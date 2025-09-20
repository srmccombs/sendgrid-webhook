#!/bin/bash

# Test webhook with CSV attachment
echo "Testing webhook with CSV attachment..."

# Create test CSV content
CSV_CONTENT="po_number,inventory_number,item,vendor_sku,po_price,po_qty,extended
04216752,10108,14 Gauge THHN Black Wire -500,JC09H42003R-0,375.00,10,3750.00
04216752,10105,12 Gauge THHN Copper Black Wire - 500,CU12SLDBLKTHHN500RL,540.00,25,13500.00
04216752,10062,#6 Bare Solid,#6BARESOL,2.42,300,726.00
04216752,10309,3/4 EMT Coupling,TC114,0.69,100,69.00
04216752,30333,\"3/4\"\" Meyers Hub\",75-23,16.77,30,503.10"

# Test with curl using multipart/form-data
curl -X POST http://localhost:3000/webhook \
  -F "from=stacymccombs@gmail.com" \
  -F "to=orders@webhook.plecticscompanies.com" \
  -F "subject=Test Order 04216752" \
  -F "text=This is a test email with CSV attachment" \
  -F "attachments=1" \
  -F "attachment1=@/Users/stacymccombs/Desktop/test order/mayer-stock-order-initial.csv;type=text/csv" \
  -v

echo ""
echo "Test complete. Check server logs for details."