{ ... }:

{
  networking = {
    hostName = "crass"; # NOTE: Define your hostname.
    networkmanager.enable = true; # Easiest to use and most distros use this by default.
  };
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

  # Block all ICMP requests
  networking.firewall.allowPing = false;
  # Open ports in the firewall.
  networking.firewall.allowedTCPPorts = [
    22 # SSH. Feel free to use a different port.
    80
    443
  ];
  networking.firewall.allowedUDPPorts = [ 51820 ];
  networking.firewall.extraCommands = ''
    # Forward packets coming in on wg1 to other peers on wg1
    iptables -A FORWARD -i wg1 -o wg1 -j ACCEPT
    iptables -A FORWARD -i wg1 -j ACCEPT
    iptables -A FORWARD -o wg1 -j ACCEPT
  '';
}
