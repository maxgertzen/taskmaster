import { DBType } from "@src/types/constants";
import { ContainerType } from "@src/types/container";
import { AwilixContainer } from "awilix";

declare global {
  namespace NodeJS {
    interface Global {
      testDbType: DBType;
      testContainer: AwilixContainer<ContainerType>;
    }
  }
  var testDbType: DBType;
  var testContainer: AwilixContainer<ContainerType>;
}
