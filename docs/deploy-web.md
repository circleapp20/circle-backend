# Circle Web App

The circle web application for the administrators is hosted on netlify due to their fast deployment service and enhanced CDN for caching assets.

Configurations for deploying to netlify are written in the netlify.toml file in the project root folder. The web app is built using next js, hence using its build system to generate the static site to deploy to netlify. The generated static files are placed in the out folder at the root folder.

The complete build script is found in the scripts/deploy-web.sh file, where the site will be built then deployed to netlify.

Make a copy of the deploy-web.sh.example file and rename to deploy-web.sh. Notice there are a few things missing, which are the site Id and the access token. These can be gotten from netlify or contact the owner of the project for them.

Run the following command to make the file executable on either a linux or mac.

```bash
sudo chmod +x ./deploy-web.sh
```

After running the command, you can now deploy the site by running the following command below

```bash
make deploy-web
```

This will build and deploy the site to netlify as a preview outputting a url to view the site.
