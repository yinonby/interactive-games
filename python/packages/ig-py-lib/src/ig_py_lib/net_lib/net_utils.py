import psutil


class NetUtils:
    @staticmethod
    def get_interface_ip(iface_name: str) -> str:
        addrs = psutil.net_if_addrs().get(iface_name)
        if not addrs:
            raise ValueError(f"Interface {iface_name} not found")

        for addr in addrs:
            if addr.family.name == "AF_INET":  # IPv4
                return addr.address

        raise ValueError(f"No IPv4 address found for {iface_name}")
