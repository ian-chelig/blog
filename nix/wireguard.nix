{
  pkgs,
  ...
}:
let
  listenport = 51820;
in
{
  boot.kernel.sysctl = {
  "net.ipv4.ip_forward" = 1;
  "net.ipv6.conf.all.forwarding" = 1;
};
  networking.wireguard.interfaces = {
    # "wg0" is the network interface name. You can name the interface arbitrarily.
    wg1 = {
      # Determines the IP address and subnet of the client's end of the tunnel interface.
      ips = [ "10.200.0.1/24" ];
      privateKeyFile = "/secrets/wgpriv.key";
      listenPort = listenport;
      peers = [
        # For a client configuration, one peer entry for the server will suffice.
        {
          #portal
          publicKey = "FuP5NEpKryk0U5t5LFTg2/egH8CHrZZGpgwEEyU5cWA=";
          allowedIPs = [ "10.200.0.2/32" ];
          persistentKeepalive = 25;
        }
        {
          #daisy phone
          publicKey = "sVskIQKeDdey9m4wMap/imWJV/Kw59jw2RpSKUXIcVU=";
          allowedIPs = [ "10.200.0.3/32" ];
          persistentKeepalive = 25;
        }
      ];
    };
  };
}
