import { assertEquals, assertFalse, assertThrows } from "assert";
import { InvalidOperationError } from "../utils/Error/InvalidOperationError.ts";
import {
  assertSpyCall,
  returnsNext,
  stub,
} from "https://deno.land/std@0.151.0/testing/mock.ts";
import { AccessLogger } from "../utils/AccessLogger.ts";

Deno.test({
  name: "isV4__ipv4のとき、trueを返すべき",
  fn(): void {
    const ipv4: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "93.184.216.34",
    };

    const accessLogger = new AccessLogger();
    const result: boolean = accessLogger.isV4(ipv4);

    assertEquals(true, result);
  },
});

Deno.test({
  name: "isV4__ipv4出ないとき、falseを返すべき",
  fn(): void {
    const ipv6: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "2001:500:8f::53",
    };

    const accessLogger = new AccessLogger();
    const result: boolean = accessLogger.isV4(ipv6);

    assertFalse(result);
  },
});

Deno.test({
  name: "createIpv4PtrRequest__ipv4逆引きurlを作成できるべき",
  fn(): void {
    const ipv4: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "93.184.216.34",
    };

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([true]));

    const result: string = accessLogger.createIpv4PtrRequest(ipv4);
    assertEquals("34.216.184.93.in-addr.arpa", result);
    assertSpyCall(isV4Stub, 0, { args: [ipv4], returned: true });
  },
});

Deno.test({
  name: "createIpv4PtrRequest__ipv4以外が来た場合例外",
  fn(): void {
    const ipv6: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "2001:500:8f::53",
    };

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([false]));

    assertThrows<InvalidOperationError>(
      () => accessLogger.createIpv4PtrRequest(ipv6),
      InvalidOperationError,
      "2001:500:8f::53はipv4でない",
    );
    assertSpyCall(isV4Stub, 0, { args: [ipv6], returned: false });
  },
});

Deno.test({
  name: "createIpv6PtrRequest__ipv6逆引きurlを作成できるべき",
  fn(): void {
    const ipv6: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "2001:500:8f::53",
    };

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([false]));

    const result: string = accessLogger.createIpv6PtrRequest(ipv6);
    assertEquals(
      "3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa",
      result,
    );
    assertSpyCall(isV4Stub, 0, { args: [ipv6], returned: false });
  },
});

Deno.test({
  name: "createIpv6PtrRequest__ipv6以外が来た場合例外",
  fn(): void {
    const ipv4: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "93.184.216.34",
    };

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([true]));

    assertThrows<InvalidOperationError>(
      () => accessLogger.createIpv6PtrRequest(ipv4),
      InvalidOperationError,
      "93.184.216.34はipv6でない",
    );
    assertSpyCall(isV4Stub, 0, { args: [ipv4], returned: true });
  },
});

Deno.test({
  name: "logger__ipv4を指定し、名前解決できた際にログにドメインを表示できる",
  async fn(): Promise<void> {
    const ipv4: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "93.184.216.34",
    };
    const url = "http://example.com";

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([true]));
    const createIpv4PtrRequestStub = stub(
      accessLogger,
      "createIpv4PtrRequest",
      returnsNext(["34.216.184.93.in-addr.arpa"]),
    );
    const resolveDnsStub = stub(
      Deno,
      "resolveDns",
      returnsNext([Promise.resolve(["example.com"])]),
    );
    const logStub = stub(console, "log");

    try {
      await accessLogger.logger(ipv4, url);
    } finally {
      resolveDnsStub.restore();
      logStub.restore();
    }

    assertSpyCall(isV4Stub, 0, { args: [ipv4], returned: true });
    assertSpyCall(createIpv4PtrRequestStub, 0, {
      args: [ipv4],
      returned: "34.216.184.93.in-addr.arpa",
    });
    assertSpyCall(resolveDnsStub, 0, {
      args: ["34.216.184.93.in-addr.arpa", "PTR"],
      returned: Promise.resolve(["example.com"]),
    });
    assertSpyCall(logStub, 0, {
      args: ["access from 93.184.216.34 (example.com) to http://example.com"],
    });
  },
});

Deno.test({
  name: "logger__ipv4を指定し、名前解決できなかった場合ipアドレスだけのログを表示できる",
  async fn(): Promise<void> {
    const ipv4: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "93.184.216.34",
    };
    const url = "http://example.com";

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([true]));
    const createIpv4PtrRequestStub = stub(
      accessLogger,
      "createIpv4PtrRequest",
      returnsNext(["34.216.184.93.in-addr.arpa"]),
    );
    const resolveDnsStub = stub(
      Deno,
      "resolveDns",
      returnsNext([
        Promise.reject(
          "no record found for name: 34.216.184.93.in-addr.arpa. type: PTR class: IN",
        ),
      ]),
    );
    const logStub = stub(console, "log");

    try {
      await accessLogger.logger(ipv4, url);
    } finally {
      resolveDnsStub.restore();
      logStub.restore();
    }

    assertSpyCall(isV4Stub, 0, { args: [ipv4], returned: true });
    assertSpyCall(createIpv4PtrRequestStub, 0, {
      args: [ipv4],
      returned: "34.216.184.93.in-addr.arpa",
    });
    assertSpyCall(resolveDnsStub, 0, {
      args: ["34.216.184.93.in-addr.arpa", "PTR"],
    });
    assertSpyCall(logStub, 0, {
      args: ["access from 93.184.216.34 to http://example.com"],
    });
  },
});

Deno.test({
  name: "logger__ipv6を指定し、名前解決できた際にログにドメインを表示できる",
  async fn(): Promise<void> {
    const ipv6: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "2001:500:8f::53",
    };
    const url = "http://example.com";

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([false]));
    const createIpv6PtrRequestStub = stub(
      accessLogger,
      "createIpv6PtrRequest",
      returnsNext([
        "3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa",
      ]),
    );
    const resolveDnsStub = stub(
      Deno,
      "resolveDns",
      returnsNext([Promise.resolve(["example.com"])]),
    );
    const logStub = stub(console, "log");

    try {
      await accessLogger.logger(ipv6, url);
    } finally {
      resolveDnsStub.restore();
      logStub.restore();
    }

    assertSpyCall(isV4Stub, 0, { args: [ipv6], returned: false });
    assertSpyCall(createIpv6PtrRequestStub, 0, {
      args: [ipv6],
      returned:
        "3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa",
    });
    assertSpyCall(resolveDnsStub, 0, {
      args: [
        "3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa",
        "PTR",
      ],
      returned: Promise.resolve(["example.com"]),
    });
    assertSpyCall(logStub, 0, {
      args: ["access from 2001:500:8f::53 (example.com) to http://example.com"],
    });
  },
});

Deno.test({
  name: "logger__ipv4を指定し、名前解決できなかった場合ipアドレスだけのログを表示できる",
  async fn(): Promise<void> {
    const ipv6: Deno.NetAddr = {
      transport: "tcp",
      port: 1,
      hostname: "2001:500:8f::53",
    };
    const url = "http://example.com";

    const accessLogger = new AccessLogger();
    const isV4Stub = stub(accessLogger, "isV4", returnsNext([false]));
    const createIpv6PtrRequestStub = stub(
      accessLogger,
      "createIpv6PtrRequest",
      returnsNext([
        "3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa",
      ]),
    );
    const resolveDnsStub = stub(
      Deno,
      "resolveDns",
      returnsNext([
        Promise.reject(
          "no record found for name: 3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa. type: PTR class: IN",
        ),
      ]),
    );
    const logStub = stub(console, "log");

    try {
      await accessLogger.logger(ipv6, url);
    } finally {
      resolveDnsStub.restore();
      logStub.restore();
    }

    assertSpyCall(isV4Stub, 0, { args: [ipv6], returned: false });
    assertSpyCall(createIpv6PtrRequestStub, 0, {
      args: [ipv6],
      returned:
        "3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa",
    });
    assertSpyCall(resolveDnsStub, 0, {
      args: [
        "3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.f.8.0.0.0.0.5.0.1.0.0.2.ip6.arpa",
        "PTR",
      ],
    });
    assertSpyCall(logStub, 0, {
      args: ["access from 2001:500:8f::53 to http://example.com"],
    });
  },
});
