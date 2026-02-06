# Translation module

This module and its contents are used for adding simple translation to server and client.
That allows the server to send translation-keys to the client and stop caring about using the correct language in a
multi-language setup.
It also makes the whole translation calls type safe and prevents using undefined translation keys.

To add a new translation, just:

- Extend the Schema in the [LanguageMap](lang/LanguageMap.ts)
- Adjust the translation in all languages accordingly, e.g. [German](lang/de_DE.ts)

Then just use the type `TranslationKey` and finally translate with:

```typescript
// literally with the default language
translate("my.translation.key")

// inserting parameters
// example: " You scored %points% out of %max% "
translate("my.translation.key", {
    points: 8,
    max: 10
})

// or with a specific language in mind
translate("my.translation.key", undefined, "de_DE")
```