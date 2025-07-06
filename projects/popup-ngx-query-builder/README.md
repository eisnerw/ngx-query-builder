# popup-ngx-query-builder

This library provides a small wrapper component that integrates an editable BQL (boolean query language) input field with `@kerwin612/ngx-query-builder`.

The component mimics the UI described in the BirthdayDemo project, showing the query text with a search button that opens the query builder in a PrimeNG dialog. The user can click the text to edit, use the dialog to modify the query tree and keep both representations in sync.

Conversion between the BQL string and the underlying `RuleSet` object is left for the host application. Placeholder methods `bqlToQuery` and `queryToBql` are included for future implementation.

```
<popup-bql-query-builder [(queryText)]="value" [config]="config"></popup-bql-query-builder>
```

PrimeNG modules (Dialog, Button, InputText) are used for the pop‑up and styling.
