//+------------------------------------------------------------------+
//| VOLTIS MT5 Connector                                             |
//| Sends closed MT5 trades to VOLTIS Trade Sync API                 |
//+------------------------------------------------------------------+
#property strict

input string VOLTIS_BASE_URL = "https://your-app.vercel.app";
input string VOLTIS_ACCOUNT_ID = "paste_voltis_account_id_here";
input string VOLTIS_SYNC_SECRET = "paste_trade_sync_secret_here";

input bool ENABLE_SYNC = false;
input int CHECK_INTERVAL_SECONDS = 30;

datetime lastCheckTime = 0;

//+------------------------------------------------------------------+
//| Expert initialization                                            |
//+------------------------------------------------------------------+
int OnInit()
{
   Print("VOLTIS MT5 Connector initialized.");
   Print("Sync enabled: ", ENABLE_SYNC);
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

   // Future implementation:
   // 1. Read MT5 closed deals from account history
   // 2. Detect only new closed trades
   // 3. Send valid closed trades to /api/trade-sync/import
   // 4. Store synced trade IDs locally to avoid duplicates
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
//| Escape JSON string                                               |
//+------------------------------------------------------------------+
string EscapeJson(string value)
{
   string result = value;

   StringReplace(result, "\\", "\\\\");
   StringReplace(result, "\"", "\\\"");

   return result;
}