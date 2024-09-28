provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "sveltekit-rg"
  location = "West Europe"  # Change this to "Germany North" or "Germany West Central" if needed
}

resource "azurerm_app_service_plan" "asp" {
  name                = "sveltekit-asp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku {
    tier     = "B1"
    size     = "B1"
    capacity = 1
  }
}

resource "azurerm_app_service" "app" {
  name                = "sveltekit-app-${substr(md5(azurerm_resource_group.rg.id), 0, 8)}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.asp.id

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_CUSTOM_IMAGE_NAME"            = "pmatthaei/sveltekit-app:latest"
  }

  site_config {
    linux_fx_version = "DOCKER|pmatthaei/sveltekit-app:latest"
  }
}

resource "azurerm_container_registry" "acr" {
  name                = "pmatthaei"  # Must be globally unique
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

output "app_service_name" {
  value = azurerm_app_service.app.name
}
