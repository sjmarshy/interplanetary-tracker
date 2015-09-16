# Interplanetary  Tracker

Keep a registry of your versioned items in [ipfs](ipfs.io) on your local
machine, and publish a list of the items to your ipns.

I can see a couple of uses for this. My own use is to keep track of little
front-end projects that I make and provide myself and others with a quick way of
linking to them all, including all of their versions. This comes with the added
advantage that the page with these links will be permanantly addressed and
hopefully available.

Another use I could envisage would be for a blog on ipfs. Write your posts, add
them and generate a home page for these posts, with the ability to update and
version your posts if you ever need to



## Usage

Create the hidden ipfsprojects folder and store the basics. This is where all
the things will go.

`iptr init`

Add a new item. itemname will be used to refer to multiple versions of the same
thing, so could be a blog post title, a project name, or anything else you could
think of.

`iptr add <itemname> <pathname> <versionname>`

open the latest version of a project name in the browser, or if a version name
is provided, open that version.

`iptr open <projectname> [versionname]`

List the items currently available, or if an item name is provided list the
versions available.

`iptr list [itemname]`

Publish your list of items as a HTML document to
your ipns

`ipfsprojects publish`
