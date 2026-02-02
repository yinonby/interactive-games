# test_net_utils.py
import socket
import unittest
from unittest.mock import Mock, patch

from .net_utils import NetUtils  # replace with your actual module


class TestNetUtils(unittest.TestCase):
    @patch("psutil.net_if_addrs")
    def test_get_interface_ip_success(self, mock_net_if_addrs):
        # Mock psutil to return a fake interface with IPv4
        mock_net_if_addrs.return_value = {
            "eth0": [
                Mock(family=socket.AF_INET, address="192.168.1.100"),
                Mock(family=socket.AF_INET6, address="::1"),
            ]
        }

        ip = NetUtils.get_interface_ip("eth0")
        self.assertEqual(ip, "192.168.1.100")

    @patch("psutil.net_if_addrs")
    def test_get_interface_ip_no_interface(self, mock_net_if_addrs):
        # Mock psutil with no matching interface
        mock_net_if_addrs.return_value = {
            "en0": [Mock(family=socket.AF_INET, address="10.0.0.5")]
        }

        with self.assertRaises(ValueError) as context:
            NetUtils.get_interface_ip("eth0")
        self.assertIn("Interface eth0 not found", str(context.exception))

    @patch("psutil.net_if_addrs")
    def test_get_interface_ip_no_ipv4(self, mock_net_if_addrs):
        # Mock psutil with interface but no IPv4 addresses
        mock_net_if_addrs.return_value = {
            "eth0": [Mock(family=socket.AF_INET6, address="::1")]
        }

        with self.assertRaises(ValueError) as context:
            NetUtils.get_interface_ip("eth0")
        self.assertIn("No IPv4 address found for eth0", str(context.exception))


if __name__ == "__main__":
    unittest.main()
