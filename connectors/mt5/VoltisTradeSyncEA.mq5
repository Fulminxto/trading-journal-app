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

//+------------------------------------------------------------------+
//| Expert initialization                                            |
//+------------------------------------------------------------------+
int OnInit()
{
   Print("VOLTIS MT5 Connector initialized.");
   Print("Sync enabled: ", ENABLE_SYNC);
   Print("Dry run: ", DRY_RUN);
   Print("Base URL: ", VOLTIS_BASE_URL);
   Print("VOLTIS Account ID: ", VOLTIS_ACCOUNT_ID);

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

      string symbol = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
      double volume = HistoryDealGetDouble(dealTicket, DEAL_VOLUME);
      double price = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
      double profit = HistoryDealGetDouble(dealTicket, DEAL_PROFIT);
      double commission = HistoryDealGetDouble(dealTicket, DEAL_COMMISSION);
      double swap = HistoryDealGetDouble(dealTicket, DEAL_SWAP);
      datetime dealTime = (datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME);
      long dealType = HistoryDealGetInteger(dealTicket, DEAL_TYPE);
      ulong positionId = (ulong)HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID);

      string direction = GetDirectionFromDealType(dealType);

      Print("VOLTIS: new closed deal detected.");
      Print("Deal ticket: ", dealTicket);
      Print("Position ID: ", positionId);
      Print("Symbol: ", symbol);
      Print("Direction: ", direction);
      Print("Volume: ", volume);
      Print("Close price: ", price);
      Print("Profit: ", profit);
      Print("Commission: ", commission);
      Print("Swap: ", swap);
      Print("Close time: ", TimeToString(dealTime, TIME_DATE | TIME_SECONDS));

      if(DRY_RUN)
      {
         Print("VOLTIS DRY RUN: deal not sent to VOLTIS.");
         MarkDealAsProcessed(dealTicket);
         continue;
      }

      // Future implementation:
      // SendClosedDealToVoltIs(...)
      // MarkDealAsProcessed(dealTicket) only after successful import.
   }
}

//+------------------------------------------------------------------+
//| Check VOLTIS health endpoint                                     |
//+------------------------------------------------------------------+
bool CheckVoltIsHealth()
{
   string response = "";

   string jsonBody =
      "{"
      "\"tradingAccountId\":\"" + EscapeJson(VOLTIS_ACCOUNT_ID) + "\","
      "\"source\":\"mt5\""
      "}";

   bool success = SendPostRequest(
      "/api/trade-sync/health",
      jsonBody,
      response
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

   Print("VOLTIS health response was not OK: ", response);
   return false;
}

//+------------------------------------------------------------------+
//| Send HTTP POST to VOLTIS                                         |
//+------------------------------------------------------------------+
bool SendPostRequest(string endpoint, string jsonBody, string &response)
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

   int statusCode = WebRequest(
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
   Print("VOLTIS response: ", response);

   return statusCode >= 200 && statusCode < 300;
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
//| Escape JSON string                                               |
//+------------------------------------------------------------------+
string EscapeJson(string value)
{
   string result = value;

   StringReplace(result, "\\", "\\\\");
   StringReplace(result, "\"", "\\\"");

   return result;
}