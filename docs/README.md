---
title: Mintlify Starter Kit
description: An overview and introduction to the Mintlify Starter Kit, including development practices and essentials for getting started.
---

# Mintlify Starter Kit

Welcome to the Mintlify Starter Kit! This kit is designed to help you get started with creating and managing your project documentation efficiently. By using this template, you'll have access to a variety of examples and best practices for structuring your documentation, including guide pages, navigation tips, customization options, and API reference pages. Additionally, you'll learn how to leverage popular components to enhance your documentation.

## Quickstart Guide

To begin, click on `Use this template` to copy the Mintlify starter kit into your repository. This action will set up a basic structure for your documentation, including essential files and folders.

### Development

For a seamless development experience, we recommend installing the [Mintlify CLI](https://www.npmjs.com/package/mintlify). This tool allows you to preview your documentation changes locally, ensuring that everything looks as expected before publishing.

To install the Mintlify CLI, run the following command:

```bash
npm i -g mintlify
```

Once installed, navigate to the root of your documentation project (where `docs.json` is located) and start the development server with:

```bash
mintlify dev
```

This command will serve your documentation locally, allowing you to view and test changes in real-time.

### Publishing Changes

To publish your documentation changes, install our GitHub App. This app automatically propagates changes from your repository to your deployment, ensuring that your documentation is always up-to-date. Changes will be deployed to production automatically after pushing to the default branch. You can find the link to install the GitHub App on your Mintlify dashboard.

## API Reference

Incorporate API reference pages into your documentation to provide detailed information about the functions, classes, or methods available in your project. This section should include function signatures, parameter descriptions, return types, and usage examples.

## Development Practices

Adopting best practices in documentation development can significantly enhance the quality and maintainability of your project documentation. Here are a few recommendations:

- Keep your documentation structure consistent.
- Use clear and concise language.
- Include code examples where relevant.
- Regularly update the documentation to reflect changes in the project.

## Essentials

### Troubleshooting

If you encounter issues while using the Mintlify CLI, here are some common solutions:

- **Mintlify dev isn't running**: Run `mintlify install` to re-install dependencies. This command ensures that all necessary packages are correctly installed and up-to-date.
- **Page loads as a 404**: Ensure that you are running the Mintlify CLI in a folder containing `docs.json`. This file is crucial for the CLI to understand and serve your documentation correctly.

By following this guide and utilizing the Mintlify Starter Kit, you'll be well on your way to creating comprehensive and user-friendly documentation for your project. Happy documenting!