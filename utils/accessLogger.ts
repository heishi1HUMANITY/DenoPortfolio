export const logger = async (from: Deno.NetAddr, url: string) => {
  try {
    const domain = await Deno.resolveDns(
      `${from.hostname.split(".").reverse().join(".")}.in-addr.arpa`,
      "PTR",
    );
    console.log(`access from ${from.hostname} (${domain[0]}) to ${url}`);
  } catch (_) {
    console.log(`access from ${from.hostname} to ${url.toString()}`);
  }
};
