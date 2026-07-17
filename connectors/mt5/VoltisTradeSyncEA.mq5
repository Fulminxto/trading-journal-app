//+------------------------------------------------------------------+
//| VOLTIS MT5 Connector                                             |
//| Sends closed MT5 trades to VOLTIS Trade Sync API                 |
//+------------------------------------------------------------------+
#property strict

input string VOLTIS_BASE_URL = "https://your-app.vercel.app";
input string VOLTIS_ACCOUNT_ID = "paste_voltis_account_id_here";
input string VOLTIS_SYNC_SECRET = "paste_trade_sync_secret_here";

input bool ENABLE_SYNC = false;
input bool DRY_RUN = true;

input int CHECK_INTERVAL_SECONDS = 30;
input int HISTORY_LOOKBACK_DAYS = 30;

datetime lastCheckTime = 0;

const int HTTP_MAX_ATTEMPTS = 3;
const int HTTP_RETRY_DELAY_MS = 500;

//+------------------------------------------------------------------+
//| Expert initialization                                            |
//+------------------------------------------------------------------+
int OnInit()
{
   Print("VOLTIS MT5 Connector initialized.");
   Print("Sync enabled: ", ENABLE_SYNC);
   Print("Dry run: ", DRY_RUN);
   Print("Base URL: ", VOLTIS_BASE_URL);

   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization                                          |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   Print("VOLTIS MT5 Connector stopped.");
}

//+------------------------------------------------------------------+
//| Expert tick                                                      |
//+------------------------------------------------------------------+
void OnTick()
{
   if(!ENABLE_SYNC)
   {
      return;
   }

   datetime now = TimeCurrent();

   if(now - lastCheckTime < CHECK_INTERVAL_SECONDS)
   {
      return;
   }

   lastCheckTime = now;

   CheckClosedTrades();
}

//+------------------------------------------------------------------+
//| Check closed trades                                              |
//+------------------------------------------------------------------+
void CheckClosedTrades()
{
   Print("VOLTIS: checking connector health...");

   if(!CheckVoltIsHealth())
   {
      Print("VOLTIS: health check failed. Trade sync skipped.");
      return;
   }

   Print("VOLTIS: health check passed.");
   Print("VOLTIS: scanning MT5 closed deals...");

   datetime toTime = TimeCurrent();
   datetime fromTime = toTime - HISTORY_LOOKBACK_DAYS * 24 * 60 * 60;

   if(!HistorySelect(fromTime, toTime))
   {
      Print("VOLTIS: HistorySelect failed. Error: ", GetLastError());
      return;
   }

   int totalDeals = HistoryDealsTotal();
   ulong selectedDeals[];

   Print("VOLTIS: total deals found in history: ", totalDeals);

   for(int index = 0; index < totalDeals; index++)
   {
      ulong dealTicket = HistoryDealGetTicket(index);

      if(dealTicket == 0)
      {
         continue;
      }

      if(IsDealAlreadyProcessed(dealTicket))
      {
         continue;
      }

      long entryType = HistoryDealGetInteger(dealTicket, DEAL_ENTRY);

      if(entryType != DEAL_ENTRY_OUT && entryType != DEAL_ENTRY_INOUT)
      {
         continue;
      }

      int selectedCount = ArraySize(selectedDeals);
      ArrayResize(selectedDeals, selectedCount + 1);
      selectedDeals[selectedCount] = dealTicket;
   }

   int totalCount = ArraySize(selectedDeals);
   Print("VOLTIS: eligible closed trades collected: ", totalCount);

   if(DRY_RUN)
   {
      for(int dryRunIndex = 0; dryRunIndex < totalCount; dryRunIndex++)
      {
         BuildTradePayloadForDeal(selectedDeals[dryRunIndex]);
         MarkDealAsProcessed(selectedDeals[dryRunIndex]);
      }

      Print("VOLTIS DRY RUN: batch prepared but not sent.");
      return;
   }

   string externalBatchId = GenerateExternalBatchId();
   string operationId = "";

   if(!StartSyncOperation(externalBatchId, totalCount, operationId))
   {
      Print("VOLTIS: batch start failed. No trades were sent.");
      return;
   }

   int localItemFailures = 0;

   for(int itemIndex = 0; itemIndex < totalCount; itemIndex++)
   {
      ulong dealTicket = selectedDeals[itemIndex];
      string itemKey = "trade:" + IntegerToString((long)dealTicket);
      string tradePayload = BuildTradePayloadForDeal(dealTicket);
      string boundPayload = BindTradeToOperation(
         tradePayload,
         operationId,
         itemKey
      );
      string itemResponse = "";
      int itemStatusCode = 0;

      bool itemSent = SendPostRequestWithRetry(
         "/api/trade-sync/import",
         boundPayload,
         itemResponse,
         itemStatusCode
      );

      if(itemSent)
      {
         MarkDealAsProcessed(dealTicket);
      }
      else
      {
         localItemFailures++;
         Print("VOLTIS: one trade item could not be confirmed; continuing batch.");
      }
   }

   if(!CompleteSyncOperation(operationId))
   {
      Print("VOLTIS: synchronization items were sent, but finalization was not confirmed.");
      return;
   }

   Print("VOLTIS: batch synchronization finalized. Local item failures: ", localItemFailures);
}

//+------------------------------------------------------------------+
//| Build one closed deal payload                                    |
//+------------------------------------------------------------------+
string BuildTradePayloadForDeal(ulong dealTicket)
{
   string symbol = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
   double volume = HistoryDealGetDouble(dealTicket, DEAL_VOLUME);
   double closePrice = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
   double profit = HistoryDealGetDouble(dealTicket, DEAL_PROFIT);
   double commission = HistoryDealGetDouble(dealTicket, DEAL_COMMISSION);
   double swap = HistoryDealGetDouble(dealTicket, DEAL_SWAP);
   datetime closeTime = (datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME);
   long dealType = HistoryDealGetInteger(dealTicket, DEAL_TYPE);
   ulong positionId = (ulong)HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID);

   string direction = GetDirectionFromDealType(dealType);

   datetime openTime = closeTime;
   double openPrice = 0.0;

   FindOpeningDealByPosition(positionId, openTime, openPrice);

   return BuildTradePayload(
      dealTicket,
      positionId,
      symbol,
      direction,
      volume,
      openTime,
      openPrice,
      closeTime,
      closePrice,
      profit,
      commission,
      swap
   );
}

//+------------------------------------------------------------------+
//| Bind the legacy trade shape to a durable operation item          |
//+------------------------------------------------------------------+
string BindTradeToOperation(
   string tradePayload,
   string operationId,
   string itemKey
)
{
   string prefix =
      "{"
      "\"operationId\":\"" + EscapeJson(operationId) + "\","
      "\"itemKey\":\"" + EscapeJson(itemKey) + "\",";

   return prefix + StringSubstr(tradePayload, 1);
}

//+------------------------------------------------------------------+
//| Build VOLTIS trade payload                                       |
//+------------------------------------------------------------------+
string BuildTradePayload(
   ulong dealTicket,
   ulong positionId,
   string symbol,
   string direction,
   double volume,
   datetime openTime,
   double openPrice,
   datetime closeTime,
   double closePrice,
   double profit,
   double commission,
   double swap
)
{
   double fees = commission + swap;

   string payload =
      "{"
      "\"tradingAccountId\":\"" + EscapeJson(VOLTIS_ACCOUNT_ID) + "\","
      "\"source\":\"mt5\","
      "\"externalTradeId\":\"" + IntegerToString((long)dealTicket) + "\","
      "\"externalAccountId\":\"" + IntegerToString((long)AccountInfoInteger(ACCOUNT_LOGIN)) + "\","
      "\"externalOrderId\":\"" + IntegerToString((long)positionId) + "\","
      "\"platform\":\"MT5\","
      "\"brokerName\":\"" + EscapeJson(AccountInfoString(ACCOUNT_COMPANY)) + "\","
      "\"symbol\":\"" + EscapeJson(symbol) + "\","
      "\"direction\":\"" + EscapeJson(direction) + "\","
      "\"openDate\":\"" + FormatIsoTime(openTime) + "\","
      "\"openTime\":\"" + FormatClockTime(openTime) + "\","
      "\"amount\":" + JsonNumber(volume) + ","
      "\"openingPrice\":" + JsonNumber(openPrice) + ","
      "\"closeDate\":\"" + FormatIsoTime(closeTime) + "\","
      "\"closingPrice\":" + JsonNumber(closePrice) + ","
      "\"resultUsd\":" + JsonNumber(profit) + ","
      "\"commission\":" + JsonNumber(commission) + ","
      "\"swap\":" + JsonNumber(swap) + ","
      "\"fees\":" + JsonNumber(fees) +
      "}";

   return payload;
}

//+------------------------------------------------------------------+
//| Find opening deal by position ID                                 |
//+------------------------------------------------------------------+
bool FindOpeningDealByPosition(
   ulong positionId,
   datetime &openTime,
   double &openPrice
)
{
   int totalDeals = HistoryDealsTotal();

   for(int index = 0; index < totalDeals; index++)
   {
      ulong ticket = HistoryDealGetTicket(index);

      if(ticket == 0)
      {
         continue;
      }

      ulong currentPositionId =
         (ulong)HistoryDealGetInteger(ticket, DEAL_POSITION_ID);

      if(currentPositionId != positionId)
      {
         continue;
      }

      long entryType = HistoryDealGetInteger(ticket, DEAL_ENTRY);

      if(entryType == DEAL_ENTRY_IN || entryType == DEAL_ENTRY_INOUT)
      {
         openTime = (datetime)HistoryDealGetInteger(ticket, DEAL_TIME);
         openPrice = HistoryDealGetDouble(ticket, DEAL_PRICE);

         return true;
      }
   }

   return false;
}

//+------------------------------------------------------------------+
//| Check VOLTIS health endpoint                                     |
//+------------------------------------------------------------------+
bool CheckVoltIsHealth()
{
   string response = "";
   int statusCode = 0;

   string jsonBody =
      "{"
      "\"tradingAccountId\":\"" + EscapeJson(VOLTIS_ACCOUNT_ID) + "\","
      "\"source\":\"mt5\""
      "}";

   bool success = SendPostRequestWithRetry(
      "/api/trade-sync/health",
      jsonBody,
      response,
      statusCode
   );

   if(!success)
   {
      Print("VOLTIS health check failed.");
      return false;
   }

   if(StringFind(response, "\"ok\":true") >= 0)
   {
      return true;
   }

   Print("VOLTIS health response was not OK.");
   return false;
}

//+------------------------------------------------------------------+
//| Start one persistent synchronization operation                   |
//+------------------------------------------------------------------+
bool StartSyncOperation(
   string externalBatchId,
   int totalCount,
   string &operationId
)
{
   string payload =
      "{"
      "\"tradingAccountId\":\"" + EscapeJson(VOLTIS_ACCOUNT_ID) + "\","
      "\"source\":\"mt5\","
      "\"externalBatchId\":\"" + EscapeJson(externalBatchId) + "\","
      "\"trigger\":\"automatic\","
      "\"totalCount\":" + IntegerToString(totalCount) +
      "}";
   string response = "";
   int statusCode = 0;

   if(!SendPostRequestWithRetry(
      "/api/trade-sync/operations/start",
      payload,
      response,
      statusCode
   ))
   {
      return false;
   }

   operationId = ExtractJsonString(response, "operationId");

   if(StringLen(operationId) == 0)
   {
      Print("VOLTIS: batch start response was missing its operation identity.");
      return false;
   }

   Print("VOLTIS: persistent synchronization batch started.");
   return true;
}

//+------------------------------------------------------------------+
//| Complete one persistent synchronization operation                |
//+------------------------------------------------------------------+
bool CompleteSyncOperation(string operationId)
{
   string payload =
      "{"
      "\"tradingAccountId\":\"" + EscapeJson(VOLTIS_ACCOUNT_ID) + "\","
      "\"source\":\"mt5\""
      "}";
   string response = "";
   int statusCode = 0;
   string endpoint =
      "/api/trade-sync/operations/" + operationId + "/complete";

   if(!SendPostRequestWithRetry(
      endpoint,
      payload,
      response,
      statusCode
   ))
   {
      return false;
   }

   string terminalStatus = ExtractJsonString(response, "status");
   long importedCount = ExtractJsonInteger(response, "importedCount");
   long updatedCount = ExtractJsonInteger(response, "updatedCount");
   long skippedCount = ExtractJsonInteger(response, "skippedCount");
   long failedCount = ExtractJsonInteger(response, "failedCount");
   long processedCount = ExtractJsonInteger(response, "processedCount");
   long totalCount = ExtractJsonInteger(response, "totalCount");
   long durationMs = ExtractJsonInteger(response, "durationMs");
   bool replayed = ExtractJsonBoolean(response, "replayed");

   Print(
      "VOLTIS: batch result status=", terminalStatus,
      ", imported=", importedCount,
      ", updated=", updatedCount,
      ", skipped=", skippedCount,
      ", failed=", failedCount,
      ", processed=", processedCount,
      ", total=", totalCount,
      ", durationMs=", durationMs,
      ", replayed=", replayed
   );

   return
      terminalStatus == "COMPLETED" ||
      terminalStatus == "PARTIAL" ||
      terminalStatus == "FAILED";
}

//+------------------------------------------------------------------+
//| Stable non-secret identifier for one scan execution              |
//+------------------------------------------------------------------+
string GenerateExternalBatchId()
{
   return StringFormat(
      "mt5-%I64d-%u",
      (long)TimeGMT(),
      GetTickCount()
   );
}

//+------------------------------------------------------------------+
//| Bounded retry wrapper                                            |
//+------------------------------------------------------------------+
bool SendPostRequestWithRetry(
   string endpoint,
   string jsonBody,
   string &response,
   int &statusCode
)
{
   for(int attempt = 1; attempt <= HTTP_MAX_ATTEMPTS; attempt++)
   {
      if(SendPostRequest(endpoint, jsonBody, response, statusCode))
      {
         return true;
      }

      bool retryable =
         statusCode == -1 ||
         statusCode == 409 ||
         statusCode == 429 ||
         statusCode >= 500;

      if(!retryable || attempt == HTTP_MAX_ATTEMPTS)
      {
         break;
      }

      Sleep(HTTP_RETRY_DELAY_MS);
   }

   return false;
}

//+------------------------------------------------------------------+
//| Send HTTP POST to VOLTIS                                         |
//+------------------------------------------------------------------+
bool SendPostRequest(
   string endpoint,
   string jsonBody,
   string &response,
   int &statusCode
)
{
   string url = VOLTIS_BASE_URL + endpoint;

   string headers =
      "Content-Type: application/json\r\n" +
      "x-voltis-sync-secret: " + VOLTIS_SYNC_SECRET + "\r\n";

   uchar postData[];
   StringToCharArray(jsonBody, postData, 0, WHOLE_ARRAY, CP_UTF8);

   if(ArraySize(postData) > 0)
   {
      ArrayResize(postData, ArraySize(postData) - 1);
   }

   uchar result[];
   string resultHeaders;

   ResetLastError();

   statusCode = WebRequest(
      "POST",
      url,
      headers,
      10000,
      postData,
      result,
      resultHeaders
   );

   if(statusCode == -1)
   {
      Print("VOLTIS WebRequest failed. Error: ", GetLastError());
      Print("Make sure the VOLTIS URL is allowed in MT5:");
      Print("Tools -> Options -> Expert Advisors -> Allow WebRequest for listed URL");
      Print("URL: ", VOLTIS_BASE_URL);

      return false;
   }

   response = CharArrayToString(result, 0, WHOLE_ARRAY, CP_UTF8);

   Print("VOLTIS response code: ", statusCode);

   return statusCode >= 200 && statusCode < 300;
}

//+------------------------------------------------------------------+
//| Minimal safe response parsing                                    |
//+------------------------------------------------------------------+
string ExtractJsonString(string json, string key)
{
   string marker = "\"" + key + "\":\"";
   int start = StringFind(json, marker);

   if(start < 0)
   {
      return "";
   }

   start += StringLen(marker);
   int finish = StringFind(json, "\"", start);

   if(finish < 0)
   {
      return "";
   }

   return StringSubstr(json, start, finish - start);
}

long ExtractJsonInteger(string json, string key)
{
   string marker = "\"" + key + "\":";
   int start = StringFind(json, marker);

   if(start < 0)
   {
      return 0;
   }

   start += StringLen(marker);
   int finish = start;

   while(finish < StringLen(json))
   {
      ushort character = StringGetCharacter(json, finish);

      if(
         character != '-' &&
         (character < '0' || character > '9')
      )
      {
         break;
      }

      finish++;
   }

   return StringToInteger(StringSubstr(json, start, finish - start));
}

bool ExtractJsonBoolean(string json, string key)
{
   string marker = "\"" + key + "\":";
   int start = StringFind(json, marker);

   if(start < 0)
   {
      return false;
   }

   start += StringLen(marker);
   return StringSubstr(json, start, 4) == "true";
}

//+------------------------------------------------------------------+
//| Get direction from MT5 deal type                                 |
//+------------------------------------------------------------------+
string GetDirectionFromDealType(long dealType)
{
   if(dealType == DEAL_TYPE_BUY)
   {
      return "BUY";
   }

   if(dealType == DEAL_TYPE_SELL)
   {
      return "SELL";
   }

   return "UNKNOWN";
}

//+------------------------------------------------------------------+
//| Local duplicate protection                                       |
//+------------------------------------------------------------------+
bool IsDealAlreadyProcessed(ulong dealTicket)
{
   string key = GetProcessedDealKey(dealTicket);

   return GlobalVariableCheck(key);
}

void MarkDealAsProcessed(ulong dealTicket)
{
   string key = GetProcessedDealKey(dealTicket);

   GlobalVariableSet(key, TimeCurrent());

   Print("VOLTIS: deal marked as processed locally: ", dealTicket);
}

string GetProcessedDealKey(ulong dealTicket)
{
   return "VOLTIS_SYNCED_" + VOLTIS_ACCOUNT_ID + "_" + IntegerToString((long)dealTicket);
}

//+------------------------------------------------------------------+
//| Formatting helpers                                               |
//+------------------------------------------------------------------+
string FormatIsoTime(datetime value)
{
   MqlDateTime dt;
   TimeToStruct(value, dt);

   return StringFormat(
      "%04d-%02d-%02dT%02d:%02d:%02d.000Z",
      dt.year,
      dt.mon,
      dt.day,
      dt.hour,
      dt.min,
      dt.sec
   );
}

string FormatClockTime(datetime value)
{
   MqlDateTime dt;
   TimeToStruct(value, dt);

   return StringFormat(
      "%02d:%02d",
      dt.hour,
      dt.min
   );
}

string JsonNumber(double value)
{
   string result = DoubleToString(value, 8);

   while(StringLen(result) > 0 && StringSubstr(result, StringLen(result) - 1, 1) == "0")
   {
      result = StringSubstr(result, 0, StringLen(result) - 1);
   }

   if(StringLen(result) > 0 && StringSubstr(result, StringLen(result) - 1, 1) == ".")
   {
      result = result + "0";
   }

   if(result == "-0.0")
   {
      result = "0.0";
   }

   return result;
}

//+------------------------------------------------------------------+
//| Escape JSON string                                               |
//+------------------------------------------------------------------+
string EscapeJson(string value)
{
   string result = value;

   StringReplace(result, "\\", "\\\\");
   StringReplace(result, "\"", "\\\"");

   return result;
}
