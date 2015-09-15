# IPFS Project Tracker

Keep a registry of projects stored in [ipfs](ipfs.io) on your local machine, and
publish a list of your projects and their history to ipns.

## Usage

Create the hidden ipfsprojects folder and store the basics. This is where all
the things will go.

`ipfsprojects init`

create a new project.

`ipfsprojects project <projectname>`

add a new version to a  project, publishing to ipfs and displaying the hash

`ipfsprojects add <projectname> <pahtname> <versionname>`

open the latest version of a project name in the browser, or a specific version

`ipfsprojects open <projectname> [<versionname>]`

List the projects currently available

`ipfsprojects list`

Publish your list of projects (latest and all versions) as a HTML document to 
your ipns

`ipfsprojects publish`
