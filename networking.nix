 { ... }:

{
  networking = {
    hostName = "blogServer"; # NOTE: Define your hostname.
    networkmanager.enable = true; # Easiest to use and most distros use this by default.
  };
  time.timeZone = "UTC";

  # Enable the OpenSSH daemon.
  services.openssh = {
    enable = true;
    # For security reasons, always have PasswordAuthentication = false
    # and instead use SSH keys.
    settings.PasswordAuthentication = false;
  };

  # Block all ICMP requests
  networking.firewall.allowPing = false;
  # Open ports in the firewall.
  networking.firewall.allowedTCPPorts = [
    22 # SSH. Feel free to use a different port.
    1337
    7700
    3000
  ];
}
