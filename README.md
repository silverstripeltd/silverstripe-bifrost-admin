![Silverstripe Search](./docs/images/logo.svg)

# Silverstripe Search Administration module

The Silverstripe Search Administration module provides an interface for configuring your search settings from within the Silverstripe CMS.

## Installation

```sh
composer require silverstripeltd/silverstripe-bifrost-admin
```

This module requires the **Forager Module** is set up and configured first so refer to [the SDK documentation](https://github.com/silverstripeltd/silverstripe-search-sdk) for how to set that up.

After installation the admin section is available in the CMS Sidebar:

![Administration screen](./docs/images/admin1.png)

Also note that the "Search Service" menu item will also be renamed "Search Indexing" to avoid confusion between these modules. 

## Permissions

The module comes with permissions so that you can control who can access the Search Service Administration area and perform administrative actions. You will need to assign these to the non-admin users you wish to be able to access it. Head to the Security section (`/admin/security`) in the CMS to do this.

![Available admin section permissions](./docs/images/permissions1.png)

Currently only Synonyms are supported:
![Available synonym permissions](./docs/images/permissions2.png)

## More information

You can get more information on the Search Service and its features in the [Service Documentation](https://search.silverstripe.cloud/resources/guides/index.html)

## Contributing

### Yarn

You will need Yarn 4.9.2. If you are using Yarn 1.xx, you will need to upgrade:
https://yarnpkg.com/getting-started/install
https://yarnpkg.com/migration/guide#migration-steps

### Building assets

TBA
