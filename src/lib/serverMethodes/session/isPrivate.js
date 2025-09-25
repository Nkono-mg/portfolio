export function isPrivatePage(pathname) {
  const privateSegment = ["/dashboard", "/settings/profile"];
  return privateSegment.some(
    (segment) => pathname === segment || pathname.startsWith(segment + "/")
  ); //some return true or false
}
