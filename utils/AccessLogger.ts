import { InvalidOperationError } from "./Error/InvalidOperationError.ts";

export class AccessLogger {
  public isV4(addr: Deno.NetAddr) {
    return addr.hostname.includes(".");
  }

  public createIpv4PtrRequest(addr: Deno.NetAddr): string {
    if (!this.isV4(addr)) {
      throw new InvalidOperationError(`${addr.hostname}はipv4でない`);
    }

    return `${addr.hostname.split(".").reverse().join(".")}.in-addr.arpa`;
  }

  public createIpv6PtrRequest(addr: Deno.NetAddr): string {
    if (this.isV4(addr)) {
      throw new InvalidOperationError(`${addr.hostname}はipv6でない`);
    }

    let segments = addr.hostname.split(":");
    if (segments.includes("")) {
      segments = [
        ...segments.slice(0, segments.indexOf("")),
        ...Array(8 - (segments.length - 1)).fill("0"),
        ...segments.slice(segments.indexOf("") + 1, segments.length),
      ];
    }
    return `${
      segments.reverse().map((segment) =>
        Array.from(segment.padStart(4, "0")).reverse().join(".")
      ).join(".")
    }.ip6.arpa`;
  }

  public async logger(from: Deno.NetAddr, url: string) {
    try {
      const domain = await Deno.resolveDns(
        this.isV4(from)
          ? this.createIpv4PtrRequest(from)
          : this.createIpv6PtrRequest(from),
        "PTR",
      );
      console.log(`access from ${from.hostname} (${domain[0]}) to ${url}`);
    } catch (_) {
      console.log(`access from ${from.hostname} to ${url.toString()}`);
    }
  }
}
