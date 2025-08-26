<!-- omit in toc -->
# Contributing to UUI

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. Please refer to the [Table of Contents](#table-of-contents) for information on various ways you can contribute and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved.

<!-- The community looks forward to your contributions. 🎉 -->

Thank you for being a part of our community and making a difference through your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project;
> - Tweet about it;
> - Refer to this project in your project's readme;
> - Mention the project at local meetups and tell your friends/colleagues.

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Have an Issue](#i-have-an-issue)
  - [Reporting Bugs](#reporting-bugs)
- [I Have an Idea](#i-have-an-idea)
  - [Suggesting For Improvement](#suggesting-for-improvement)
- [I Want To Submit Changes](#i-want-to-submit-changes)
  - [Creating a Pull Request](#creating-a-pull-request)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Start the Project](#start-the-project)
  - [Edit Documentation](#edit-documentation)

## Legal Notice

> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content, and that the content you contribute may be provided under the project license.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://uui.epam.com/documents?id=gettingStarted).

Before you ask a question, it is best to search for existing [issues](https://github.com/epam/UUI/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you still feel the need to ask a question and need clarification, we recommend the following:

- Open a new [Discussion](https://github.com/epam/UUI/discussions/new);
- Provide as much context as you can about what you're running into;
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of your question as soon as possible.

## I Have an Issue

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information, and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version;
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [Documentation](https://uui.epam.com/documents?id=gettingStarted). If you are looking for support, you might want to check [This Section](#i-have-a-question));
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your error in the [issues](https://github.com/epam/UUI/issues?q=is%3Aopen+is%3Aissue+label%3Abug).

#### How Do I Submit a Good Bug Report?

We use [GitHub Issues](https://github.com/epam/UUI/issues) to track bugs and errors. If you run into an issue with the project, please open a new [bug report](https://github.com/epam/UUI/issues/new?assignees=&labels=bug&projects=&template=bug-report.md&title=%5BComponent+name%5D%3A+clear+and+descriptive+title) and follow its template. The template provides details on all the required and optional sections, along with guidance on how to fill them out.

#### General Information About Bug Report

All defects should be created with the label "**bug**". If you use the default bug template, this label will be set automatically.
You can add an additional label(s) both during the creation of the bug and after it has been saved.

All bugs are considered with "**minor**" priority by default and will be taken to work in order of priority. If you think your bug is higher level, add the "**medium**' or  "**major**" priority to the ticket. To set the priority follow the next steps: Open the saved task -> Find "Projects" section on the right -> Click on the dropdown on the right -> Click on the dropdown with priorities and choose the one that suits you.

Here you can find examples of Good Bug Reports:
[Example #1](https://github.com/epam/UUI/issues/545)  [Example #2](https://github.com/epam/UUI/issues/552)

## I Have an Idea

### Suggesting For Improvement

This section guides you through submitting an enhancement suggestion for UUI, including completely new features and improvements to existing functionality. Following these guidelines will help maintainers and the community to understand your suggestion and identify related recommendations.

#### Before Submitting an Improvement

- Make sure that you are using the latest version;
- Read the [Documentation](https://uui.epam.com/documents?id=gettingStarted) carefully and find out if the functionality is already covered, maybe by an individual configuration;
- Perform a [search](https://github.com/epam/UUI/issues?q=is%3Aopen+is%3Aissue+label%3Aimprovement) to see if the improvement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one;
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider finding some workaround or try to implement it in your own code if it possible.

#### How Do I Submit a Good Improvement?

Improvement is tracked as [GitHub Issues](https://github.com/epam/UUI/issues). You can create a new one using [improvement template](https://github.com/epam/UUI/issues/new?assignees=&labels=improvement&projects=&template=improvement.md&title=).

- Use a clear and descriptive title for the issue to identify the suggestion;
- Describe the current behavior and explain which behavior you expected to see instead and why. At this point you can also tell which alternatives do not work for you;
- You may want to include screenshots, videos, or animated GIFs which help you demonstrate the steps or point out the part to which the suggestion is related to;
- Explain why this improvement would be useful to most UUI users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

<!-- You might want to create an issue template for enhancement suggestions that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

## I Want To Submit Changes

### Creating a Pull Request

> Before you will make your pull request, please first discuss the change you wish to make via bug report, feature request or discussion.

You can contribute to our codebase via creating Pull Request. PRs for our libraries are always welcome and can be a quick way to get your fix or improvement <!-- slated--> planned for the next release.

In general, we follow the ["Fork-and-Pull" Git workflow](https://github.com/susam/gitpr)

1. Fork and clone the repository and create your branch from the `develop` branch;
2. Create a branch locally with a succinct but descriptive name;
3. Run project according the local development [instructions](#development);
4. If you've fixed a bug or added code that should be tested, add tests;
5. Ensure the test suite passes (yarn test), update snapshots if needed;
6. If you make api changes or add new functionality, add example to the documentation and update property explorer page;
7. Add your fix short description to the changelog.md;
8. Commit and push to your fork;
9. Open a PR in our repository in `develop` branch.


## Development

### Project Structure

```
├── app    # uui.epam.com site codebase
├── epam-assets    # @epam/assets package
├── epam-promo    # @epam/promo package
├── extra    # epam/extra package
├── loveship    # epam/loveship package    
├── public    # static files for uui.epam.com site
├── server    # server for uui.epam.com site
├── templates    # templates projects fro cra and next.js
├── test-utils    # common utils for unit tests
├── uui    # epam/uui package
├── uui-build    # epam/uui-build package
├── uui-components    # epam/uui-components package
├── uui-core    # epam/core package
├── uui-db    # epam/db package
├── uui-docs    # epam/docs package
├── uui-editor    # epam/editor package
└── uui-timeline    # epam/timeline package
```

### Start the Project

1. Clone Github repository:

```
git clone git@github.com:epam/UUI.git
```

2. Install server dependencies:

```
cd ./server
yarn
```
3. Go back to the `UUI` folder and run the App:

```
cd ../
yarn
yarn build-server
yarn start
```

This will open the uui.epam.com web-site locally, in watch mode.

### Edit Documentation
In case if you add new functionality or change API, you need to update our Documentation.
All UUI Documentation is placed on [uui.epam.com](https://uui.epam.com/) website, which sources are in `./app` folder.

Below you can find instructions how to add Doc Example and update component property explorer page.

#### Doc Example

1. Go to `app/src/docs/_examples` and open/add folder of component for which you need to add example;
2. Add example with the following file name pattern `example-name.example.tsx`;
3. Go to the `app/src/docs/pages` and find/add appropriate page file and add link your example to doc page:
    ```
      { "name": "Basic", "componentPath": "alert/Basic.example.tsx" },
   ```
4. If you add the new documents page, change `app/src/documents/structure.ts` file to add your page to the sidebar menu.

#### Property Explorer

We use Property Explorer to be able to test component in different variations of props. You can find Property Explorer tab on the Documentation page of each component.

If you make any component prop changes, you need to update appropriate .doc file, which used for building component property explorer page.

1. Go to the `app/src/docs/explorerConfigs` folder and find/add appropriate config file
2. Add new prop examples via `prop` method:
    ```
       .prop('size', { examples: ['24', '30', '36', '42', '48'] , defaultValue: '36' })
   ```
   Some common props interfaces is already implemented, and you can add them via `implements` method:
    ```
       .implements([ isDisabledDoc, iCanRedirectDoc, iHasPlaceholder])
   ```

#### API Block

Component API section generated based on component props interfaces. It's not mandatory to regenerate it locally, because we have it in a deployment steps.

Nevertheless, to update this block, please run `yarn generate-components-api` command in project root.
