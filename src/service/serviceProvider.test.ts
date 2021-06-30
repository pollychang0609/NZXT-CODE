import { Service, SERVICE_TYPE } from "./iService";
import ServiceProvider from "./serviceProvider";
import { UserService } from "./userService";

describe("# ServiceProvider", function () {
  it("should get userService correctly", async function (done) {
    const service = ServiceProvider.getService(SERVICE_TYPE.USER);
    expect(service).toBeInstanceOf(Service);
    expect(service).toBeInstanceOf(UserService);
    done();
  });
});
