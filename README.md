## npm Git-Merge-Unrelated

Join several old repositories into a single one.

I used it for https://github.com/JustinHorn/websiteAndApps and https://github.com/JustinHorn/small_scripts

### How to use

```
$ gmu --fN folderName --ssh githubSSH key
```

### How to set up?

`$ npm i -g git-merge-unrelated `

or via github:

1. git clone git@github.com:JustinHorn/git-merge-unrelated.git
2. cd git-merge-unrelated
3. npm i -g .
4. use it empty repos with atleast 1 commit

### Information Regarding it's use:

- the repo needs to have atleast one commit for it to properly work
- the root folder should only contain folders of other projects
- there should be no staged files

Inspired by this [stackoverflow answer](https://stackoverflow.com/questions/1425892/how-do-you-merge-two-git-repositories#answer-10548919)
