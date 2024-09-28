provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "prain-group"
  location = "West Europe"  # Adjust as needed
}

resource "azurerm_service_plan" "asp" {
  name                = "prain-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  sku {
    name     = "B1"  # SKU name (Basic)
    tier     = "Basic"  # SKU tier
    capacity = 1  # Number of instances (optional)
  }
}

resource "azurerm_app_service" "app" {
  name                = "prain-app-${substr(md5(azurerm_resource_group.rg.id), 0, 8)}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_service_plan.asp.id

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_CUSTOM_IMAGE_NAME"            = "pmatthaei/prain-app:latest"  # Your Docker Hub image
    "DOCKER_REGISTRY_SERVER_URL"          = "https://index.docker.io/v1/"     # Correct Docker Hub URL
    "DOCKER_REGISTRY_SERVER_USERNAME"     = var.docker_hub_username             # Docker Hub username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = var.docker_hub_password             # Docker Hub password
  }

  site_config {
    linux_fx_version = "DOCKER|pmatthaei/prain-app:latest"  # Use Docker Hub image
  }
}

output "app_service_name" {
  value = azurerm_app_service.app.name
}
