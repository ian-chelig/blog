{ pkgs, ... }:

{
  time.timeZone = "UTC";

  # Enable the OpenSSH daemon.
  services.openssh = {
    enable = true;
    settings = {
      # For security reasons, always have PasswordAuthentication = false
      # and instead use SSH keys.
      PasswordAuthentication = false;
      PermitRootLogin = "no";
      AllowUsers = [ "daisy" ];
    };
  };
  networking = {
    hostName = "crass"; # NOTE: Define your hostname.
    networkmanager.enable = true;
    nameservers = [
      "192.168.168.3"
      "192.168.168.4"
    ];

    firewall = {
      # Block all ICMP requests
      allowPing = false;
      allowedTCPPorts = [
        80
        443
      ];
      allowedUDPPorts = [ 51820 ];
      extraCommands = ''
        # Forward packets coming in on wg1 to other peers on wg1
        iptables -A FORWARD -i wg1 -o wg1 -j ACCEPT
        iptables -A FORWARD -i wg1 -j ACCEPT
        iptables -A FORWARD -o wg1 -j ACCEPT
        ${pkgs.iproute2}/bin/ip route add 10.0.0.0/24 via 10.200.0.2 dev wg1 || true
      '';
    };
  };
}
