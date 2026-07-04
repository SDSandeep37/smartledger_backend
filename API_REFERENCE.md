# SmartLedger API Reference

Local base URL:

```text
http://localhost:5000/smartledger
```

Authenticated routes require the JWT cookie created by login/register. Browser requests should include credentials.

```js
fetch(url, {
  credentials: "include",
});
```

## User

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/user/register` | No | Register a user and create a session |
| `POST` | `/user/login` | No | Log in and create a session |
| `POST` | `/user/logout` | Yes | Clear the current session cookie |
| `GET` | `/user/session` | Yes | Return the current logged-in user |

Register body:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Password@123",
  "role": "owner"
}
```

Login body:

```json
{
  "email": "demo@example.com",
  "password": "Password@123"
}
```

## Company

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/company/create` | Yes | Create a company for the logged-in user |
| `PUT` | `/company/:companyId/update` | Yes | Update a company |
| `GET` | `/company/:companyId/company` | Yes | Get company details |
| `GET` | `/company/companies` | Yes | List companies owned by the user |
| `DELETE` | `/company/:companyId` | Yes | Delete a company |
| `GET` | `/company/search?companyName=value` | Yes | Search companies by name |

Create/update body:

```json
{
  "company_name": "Acme Traders",
  "address": "Main Road",
  "city": "Kochi",
  "state": "Kerala",
  "country": "India",
  "pincode": "682001",
  "gst_number": "32ABCDE1234F1Z5",
  "pan_number": "ABCDE1234F",
  "financial_year_start": "2026-04-01",
  "financial_year_end": "2027-03-31",
  "phone": "9876543210",
  "email": "accounts@acme.test"
}
```

## Ledger Groups

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/ledger-group/create` | Yes | Create a ledger group |
| `PUT` | `/ledger-group/:ledgerGroupId/update` | Yes | Update a ledger group |
| `GET` | `/ledger-group/:companyId/all` | Yes | List ledger groups for a company |
| `GET` | `/ledger-group/:id` | Yes | Get one ledger group |
| `DELETE` | `/ledger-group/:id` | Yes | Delete a ledger group |

Create/update body:

```json
{
  "company_id": "company-uuid",
  "group_name": "Sundry Debtors",
  "nature": "Assets",
  "parent_group_id": null
}
```

Allowed `nature` values are `Assets`, `Liabilities`, `Income`, and `Expenses`.

## Ledgers

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/ledger/create` | Yes | Create a ledger |
| `PUT` | `/ledger/:ledgerId/update` | Yes | Update a ledger |
| `GET` | `/ledger/:companyId/company` | Yes | List company ledgers |
| `GET` | `/ledger/:ledgerId/ledger` | Yes | Get one ledger |
| `GET` | `/ledger/:companyId/search?keyword=value` | Yes | Search ledgers |
| `DELETE` | `/ledger/:ledgerId/delete` | Yes | Delete a ledger |

Create/update body:

```json
{
  "company_id": "company-uuid",
  "group_id": "ledger-group-uuid",
  "ledger_name": "ABC Supplier",
  "alias_name": "ABC",
  "opening_balance": 0,
  "balance_type": "Cr",
  "gst_number": "",
  "pan_number": "",
  "phone": "9876543210",
  "email": "supplier@example.com",
  "address": "Market Road",
  "notes": ""
}
```

## Units

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/unit/create` | Yes | Create a unit |
| `PUT` | `/unit/:id/update` | Yes | Update a unit |
| `GET` | `/unit/:companyId/company` | Yes | List company units |
| `GET` | `/unit/:unitId` | Yes | Get one unit |
| `DELETE` | `/unit/:unitId/delete` | Yes | Delete a unit |

Create/update body:

```json
{
  "company_id": "company-uuid",
  "unit_name": "Kilogram",
  "unit_symbol": "kg"
}
```

## Stock Groups

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/stock-group/create` | Yes | Create a stock group |
| `PUT` | `/stock-group/:group_id/update` | Yes | Update a stock group |
| `GET` | `/stock-group/:groupId` | Yes | Get one stock group |
| `GET` | `/stock-group/:companyId/company` | Yes | List company stock groups |
| `GET` | `/stock-group/:companyId/search?keyword=value` | Yes | Search stock groups |
| `DELETE` | `/stock-group/:groupId/delete` | Yes | Delete a stock group |

Create/update body:

```json
{
  "company_id": "company-uuid",
  "group_name": "Raw Materials",
  "parent_group_id": null
}
```

## Stock Items

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/stock-item/create` | Yes | Create a stock item |
| `PUT` | `/stock-item/:itemId/update` | Yes | Update a stock item |
| `GET` | `/stock-item/:itemId` | Yes | Get one stock item |
| `GET` | `/stock-item/:companyId/company` | Yes | List company stock items |
| `GET` | `/stock-item/:companyId/search?search=value` | Yes | Search stock items |
| `DELETE` | `/stock-item/:itemId/delete` | Yes | Delete a stock item |

Create/update body:

```json
{
  "company_id": "company-uuid",
  "stock_group_id": "stock-group-uuid",
  "unit_id": "unit-uuid",
  "item_name": "Steel Rod",
  "sku": "STL-001",
  "purchase_price": 100,
  "selling_price": 125,
  "opening_stock": 10,
  "minimum_stock": 2,
  "current_stock": 10,
  "gst_percent": 18
}
```

## Vouchers

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/voucher/create` | Yes | Create a purchase or sales voucher |
| `GET` | `/voucher/:companyId/company` | Yes | List company vouchers |
| `GET` | `/voucher/:companyId/search?keyword=value` | Yes | Search vouchers |
| `GET` | `/voucher/:voucherId` | Yes | Get one voucher |
| `DELETE` | `/voucher/:voucherId` | Yes | Delete a voucher and reverse stock movement |

Create body:

```json
{
  "company_id": "company-uuid",
  "voucher_type": "Purchase",
  "financial_year": "2026-2027",
  "voucher_date": "2026-07-04",
  "party_ledger_id": "ledger-uuid",
  "narration": "Purchase invoice",
  "items": [
    {
      "stock_item_id": "stock-item-uuid",
      "quantity": 2,
      "rate": 100,
      "discount_percent": 5,
      "gst_percent": 18
    }
  ]
}
```

Allowed `voucher_type` values are `Purchase` and `Sales`.

The backend calculates:

- Discount amount
- Taxable amount
- GST amount
- Line total
- Voucher total
- Voucher number with `PUR-000001` or `SAL-000001` style prefixes

Purchase vouchers increase stock. Sales vouchers decrease stock.
