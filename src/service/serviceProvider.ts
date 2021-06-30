import { SERVICE_TYPE, Service } from "./iService";
import { UserService } from "./userService";

class ServiceProvider {
  public static getService(type: SERVICE_TYPE): Service {
    if (type == SERVICE_TYPE.USER) {
      return UserService.getInstance();
    }
    throw Error("Unknow Service Type");
  }
}

export default ServiceProvider;
