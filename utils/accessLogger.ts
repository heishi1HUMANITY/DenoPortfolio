export const logger = async (from: Deno.NetAddr, url: string) => {
  try {
    const domain = await Deno.resolveDns(
      isV4(from) ? createIpv4PtrRequest(from) : createIpv6PtrRequest(from),
      "PTR",
    );
    console.log(`access from ${from.hostname} (${domain[0]}) to ${url}`);
  } catch (_) {
    console.log(`access from ${from.hostname} to ${url.toString()}`);
  }
};

const isV4 = (addr: Deno.NetAddr): boolean => addr.hostname.includes(".");

const createIpv4PtrRequest = (addr: Deno.NetAddr): string =>
  `${addr.hostname.split(".").reverse().join(".")}.in-addr.arpa`;

const createIpv6PtrRequest = (addr: Deno.NetAddr): string => {
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
};
