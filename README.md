Step 1: Prerequisites
1.	Create a Microsoft Azure Account
•	Go to https://azure.microsoft.com
•	Click "Start Free" or "Free Account"
•	Sign in with your Microsoft account or create one
•	You'll need to provide credit card details (for verification, but won't be charged during free tier)

Step 2: Set Up Development Environment
1.	Install Required Tools:
•	Download and install Visual Studio Code (https://code.visualstudio.com)
•	Install Node.js (https://nodejs.org) - Choose LTS version
•	Install Azure CLI (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

Step 3: Prepare Your Application
1.	Create a new folder on your computer:
•	mkdir team-generator
•	cd team-generator

2.	Copy all the code files we created earlier into this folder:
•	src/App.tsx
•	src/types.ts
•	src/utils/teamGenerator.ts
•	And all other project files

3.	Create a production build:
•	npm install
•	npm run build

This will create a dist folder with your production-ready files.

Step 4: Set Up Azure Resources
1.	Open Azure Portal (https://portal.azure.com)
1.	Create a Resource Group:
•	Click "Create a resource" (plus icon in top left)
•	Search for "Resource Group"
•	Click "Create"
Fill in:
•	Subscription: Your subscription
•	Resource group name: "team-generator-rg"
•	Region: Choose nearest to you
•	Click "Review + create"
•	Click "Create"


2.Create an App Service:
•	Click "Create a resource"
•	Search for "Web App"
•	Click "Create"

Fill in:
•	Subscription: Your subscription
•	Resource group: "team-generator-rg" (select the one you created)
•	Name: "team-generator-app" (must be unique)
•	Publish: "Code"
•	Runtime stack: "Node 18 LTS"
•	Operating System: "Windows"
•	Region: Same as resource group
•	Windows Plan: Create new
•	Name: "team-generator-plan"
•	Sku and size: Free F1 (for testing)
•	Click "Review + create"
•	Click "Create"

Step 5: Deploy Your Application
1.	Install Azure Tools in VS Code:
•	Open VS Code
•	Go to Extensions (puzzle piece icon)
•	Search for "Azure Tools"
•	Install "Azure Tools" extension pack

2.	Deploy from VS Code:
•	Open your project in VS Code
•	Click Azure icon in left sidebar
•	Sign in to Azure if prompted
•	Under "RESOURCES", find your App Service ("team-generator-app")
•	Right-click it
•	Select "Deploy to Web App"
•	Choose the dist folder when prompted
•	Wait for deployment to complete

Step 6: Verify Deployment
1.	Go to Azure Portal
2.	Find your App Service ("team-generator-app")
3.	Click "Browse" (or copy the URL)
4.	Your application should now be live!

Step 7: Set Up Database (Azure PostgreSQL)
1.	Create Database:
•	Go to Azure Portal
•	Click "Create a resource"
•	Search for "Azure Database for PostgreSQL"
•	Choose "Flexible server"
•	Click "Create"
Fill in:
•	Subscription: Your subscription
•	Resource group: "team-generator-rg"
•	Server name: "team-generator-db"
•	Region: Same as before
•	PostgreSQL version: 15
•	Authentication: Choose "Password"
•	Admin username: Remember this!
•	Password: Create a strong password and save it!
•	Click "Review + create"
•	Click "Create"

2.	Configure Database:
•	Wait for deployment to complete
•	Go to your database resource
•	Under "Settings" → "Networking"
•	Add your client IP address
•	Enable "Allow Azure services to access server"
•	Save changes

3.	Connect Application:
•	Go to your App Service
•	Click "Configuration"
•	Add these Application settings:
•	POSTGRES_HOST: Your database server name
•	POSTGRES_USER: Your admin username
•	POSTGRES_PASSWORD: Your database password
•	POSTGRES_DATABASE: Your database name
•	Click "Save"
Important Tips:
1)	Always start with Free tier for testing
2)	Monitor your costs in Azure Portal
3)	Set up spending limits in your Azure account
4)	Use Azure's free resources when possible
5)	Remember to secure your database credentials

Common Issues and Solutions:
1.	If deployment fails:
•	Check logs in Azure Portal
•	Verify Node.js version matches
•	Ensure all dependencies are in package.json

2.	If database connection fails:
•	Check firewall rules
•	Verify connection strings
•	Ensure service is running

3.	If application doesn't load:
•	Check browser console
•	Review App Service logs
•	Verify build was successful

