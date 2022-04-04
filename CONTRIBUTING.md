<!-- omit in toc -->
# Contributing to UUI

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Creating a Pull Request](#creating-a-pull-request)


## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://uui.epam.com/documents?id=gettingStarted).

Before you ask a question, it is best to search for existing [Issues](https://github.com/epam/UUI/issues) or [discussions](https://github.com/epam/UUI/discussions) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an new [discussion](https://github.com/epam/UUI/discussions/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of your question as soon as possible.

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://uui.epam.com/documents?id=gettingStarted). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [issues](https://github.com/epam/UUI/issues).

#### How Do I Submit a Good Bug Report?

We use GitHub issues to track bugs and errors. If you run into an issue with the project, please open a new [Issue](https://github.com/epam/UUI/issues/new) and follow the bug report template. The good bug report will have:

- Use a **clear and descriptive title** for the issue to identify the bug.
- A quick summary and/or background
- Steps to reproduce
    - Be specific!
    - Give sample code if you can. You can use our UUI [codesandbox](https://codesandbox.io/s/uui-bddgvi?file=/src/Example.tsx) template for it.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)


### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for UUI, **including completely new features and improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://uui.epam.com/documents?id=gettingStarted) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/epam/UUI/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider to find some workaround or try to implement it in your own code if is possible.

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/epam/UUI/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. 
- **Explain why this enhancement would be useful** to most UUI users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

<!-- You might want to create an issue template for enhancement suggestions that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Creating a Pull Request

> Before you will make your pull request, please first discuss the change you wish to make via bug report, feature request or discussion.

You can contribute to our codebase via creating Pull Request. PRs to our libraries are always welcome and can be a quick way to get your fix or improvement slated for the next release. 

In general, we follow the ["fork-and-pull" Git workflow](https://github.com/susam/gitpr)

1. Fork the repository and create your branch from the `develop` branch.
2. Clone the project to your machine
3. Create a branch locally with a succinct but descriptive name.
4. Run project according the local development [instructions](https://github.com/epam/UUI#development).
5. If you've fixed a bug or added code that should be tested, add tests!
6. Ensure the test suite passes(yarn test), update snapshots if needed.
7. Commit and push to your fork.
8. Open a PR in our repository in `develop` branch.
