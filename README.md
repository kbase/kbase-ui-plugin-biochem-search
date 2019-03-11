# KBase UI Plugin - biochem Search

[ to be written... ]

## How to Develop

-   in a working directory, clone kbase-ui and this repo

```
git clone -b develop https://github.com/kbase/kbase-ui
git clone https://github.com/kbase/kbase-ui-plugin-biochem-search
```

-   start up the ui with the biochem-search plugin overlaid:

```
cd kbase-ui
make dev-start env=dev build=dev build-image=t plugins="biochem-search"
```

-   map ci.kbase.us to localhost:

```
sudo vi /etc/hosts
127.0.0.1	ci.kbase.us
```

-   biochem-search should be on the hamburger menu

-   you now should be able to enter the edit / save /refresh loop, edit and save biochem-search, then reload the browser to see your changes.
