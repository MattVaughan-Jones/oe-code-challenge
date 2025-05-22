- All components look fine on mobile so no need to make components responsive at this stage.
- For the most part, I made generic components reusable where possible (eg Filter.tsx)
- Built the payment history as a view rather than a page because:
  - Better UX when switching between views.
  - Easier to set up
    Major con:
  - not bookmarkable/can't get a shareable link
    Can easily change later if required.
- wrote unit tests for only a section of the front end codebase to allow more time to demonstrate my approach to other aspects of development. Had better coverage of the back end, but only wrote tests that add value -> don't have 100% coverage
- Decided against graphQL -> the overhead isn't justified for the simple data model and no team interfaces.
- OpenAPI doc
- Account validation middleware

TODO with more time:

- UI library
- Outsource payment handling to a 3rd party provider for security/scope of responsibility reasons
- Make search bar and dropdown components reusable
- Implement db
- Implement Auth for API access

This was completed with AI assistance. It increased my output, helped troubleshoot issues, and provided feedback on various approaches. For example, I learned about swagger-jsdoc, which I ended up not using.
