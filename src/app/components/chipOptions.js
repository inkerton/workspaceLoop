const chipOptions = [
    {
      group: "Reconnaissance",
      options: [
        { value: "T1595", info: "Active Scanning" },
        { value: "T1592", info: "Gather Victim host Information" },
        { value: "T1589", info: "Gather Victim Identity Information" },
        { value: "T1590", info: "Gather Victim Network Information" },
        { value: "T1591", info: "Gather Victim Org Information" },
        { value: "T1598", info: "Phishing for Information" },
        { value: "T1597", info: "Search Closed Sources" },
        { value: "T1596", info: "Search Open Technical Databases" },
        { value: "T1593", info: "Search Open Websites/Domains" },
        { value: "T1594", info: "Search Victim-owned Websites" },
      ],
    },
    {
      group: "Resource Development",
      options: [
        { value: "T1650", info: "Acquire Access" },
        { value: "T1583", info: "Acquire Infrastrusture" },
        { value: "T1586", info: "Compromise Accounts" },
        { value: "T1584", info: "Compromise Infrastructure" },
        { value: "T1587", info: "Develop Capabilities" },
        { value: "T1585", info: "Establish Accounts" },
        { value: "T1588", info: "Obtain Capabilities" },
        { value: "T1608", info: "Stage Capabilities" },
      ],
    },
    {
      group: "Initial Access",
      options: [
        { value: "T1659", info: "Content Injection" },
        { value: "T1189", info: "Drive-by Compromise" },
        { value: "T1190", info: "Exploit Public-Facing Application" },
        { value: "T1133", info: "External Remote Services" },
        { value: "T1200", info: "Hardware Additions" },
        { value: "T1566", info: "Phishing" },
        { value: "T1091", info: "Replication Through Removable Media" },
        { value: "T1195", info: "Supply Chain Compromise" },
        { value: "T1199", info: "Trusted Relationship" },
        { value: "T1078", info: "Valid Accounts" },
      ],
    },
    {
      group: "Execution",
      options: [
        { value: "T1651", info: "Cloud Administration Command" },
        { value: "T1059", info: "Command and Scripting Interpreter" },
        { value: "T1609", info: "Container Aministration Command" },
        { value: "T1610", info: "Deploy Container" },
        { value: "T1203", info: "Exploitation for Client Execution" },
        { value: "T1559", info: "Inter-Process Communication" },
        { value: "T1106", info: "Native API" },
        { value: "T1053", info: "Scheduled Task/Job" },
        { value: "T1648", info: "Serverless Execution" },
        { value: "T1129", info: "Shared Modules" },
        { value: "T1072", info: "Software Deployment Tools" },
        { value: "T1569", info: "System Services" },
        { value: "T1204", info: "User Execution" },
        { value: "T1047", info: "Windows Management Instrumentation" },
      ],
    },
    {
      group: "Persistence",
      options: [
        { value: "T1098", info: "Account Manipulation" },
        { value: "T1197", info: "BITS Jobs" },
        { value: "T1547", info: "Boot or Logon Autostart Execution" },
        { value: "T1037", info: "Boot or Logon Initialization Scripts" },
        { value: "T1176", info: "Browser Extensions" },
        { value: "T1554", info: "Compromise Host Software Binary" },
        { value: "T1136", info: "Create Account" },
        { value: "T1543", info: "Create or Modify System Process" },
        { value: "T1546", info: "Event Triggered Execution" },
        { value: "T1133", info: "External Remote Services" },
        { value: "T1574", info: "Hijack Execution Flow" },
        { value: "T1525", info: "Implant Internal Image" },
        { value: "T1556", info: "Modify Authentication Process" },
        { value: "T1137", info: "Office Application Startup" },
        { value: "T1653", info: "Power Settings" },
        { value: "T1542", info: "Pre-OS Boot" },
        { value: "T1053", info: "Scheduled Task/Job" },
        { value: "T1505", info: "Server Software Component" },
        { value: "T1205", info: "Traffic Signaling" },
        { value: "T1078", info: "Valid Accounts" },
      ],
    },
    {
      group: "Privilege Escalation",
      options: [
        { value: "T1548", info: "Abuse Elevation Control Mechanism" },
        { value: "T1134", info: "Access Token Manipulation" },
        { value: "T1098", info: "Account Manipulation" },
        { value: "T1547", info: "Boot or Logon Autostart Execution" },
        { value: "T1037", info: "Boot or Logon Initialization Scripts " },
        { value: "T1543", info: "Create or Modify System Process" },
        { value: "T1484", info: "Domain or Tenant Policy Modification" },
        { value: "T1611", info: "Escape to Host" },
        { value: "T1546", info: "Event Triggered Execution" },
        { value: "T1068", info: "Exploitation for Privilege Escalation" },
        { value: "T1574", info: "Hijack Execution Flow" },
        { value: "T1055", info: "Process Injection" },
        { value: "T1053", info: "Scheduled Task/Job" },
        { value: "T1078", info: "Valid Accounts" },
      ],
    },
    {
      group: "Defense Evasion",
      options: [
        { value: "T1548", info: "Abuse Elevation Control Mechanism" },
        { value: "T1134", info: "Access Token Manipulation" },
        { value: "T1197", info: "BITS Jobs" },
        { value: "T1612", info: "Build Image on Host" },
        { value: "T1622", info: "Debugger Evasion" },
        { value: "T1140", info: "Deobfuscate/Decode Files or Information" },
        { value: "T1610", info: "Deploy Container" },
        { value: "T1006", info: "Direct Volume Access" },
        { value: "T1484", info: "Domain or Tenant Policy Modification" },
        { value: "T1480", info: "Execution Guardrails" },
        { value: "T1211", info: "Exploitation for Defense Evasion" },
        { value: "T1222", info: "File and Directory Permissions Modification" },
        { value: "T1564", info: "Hide Artifacts" },
        { value: "T1574", info: "Hijack Execution Flow" },
        { value: "T1562", info: "Impair Defenses" },
        { value: "T1656", info: "Impersonation" },
        { value: "T1070", info: "Indicator Removal" },
        { value: "T1202", info: "Indirect Command Execution" },
        { value: "T1036", info: "Masquerading" },
        { value: "T1556", info: "Modify Authentication Process" },
        { value: "T1578", info: "Modify Cloud Compute Infrastructure" },
        { value: "T1112", info: "Modify Registry" },
        { value: "T1601", info: "Modify System Image" },
        { value: "T1599", info: "Network Boundary Bridging" },
        { value: "T1027", info: "Obfuscated Files or Information" },
        { value: "T1647", info: "Plist File Modification" },
        { value: "T1542", info: "Pre-OS Boot" },
        { value: "T1055", info: "Process Injection" },
        { value: "T1620", info: "Reflective Code Loading" },
        { value: "T1207", info: "Rogue Domain Controller" },
        { value: "T1014", info: "Rootkit" },
        { value: "T1553", info: "Subvert Trust Controls" },
        { value: "T1218", info: "System Binary Proxy Execution" },
        { value: "T1216", info: "System Script Proxy Execution" },
        { value: "T1221", info: "Template Injection" },
        { value: "T1205", info: "Traffic Signaling" },
        { value: "T1127", info: "Trusted Developer Utilities Proxy Execution" },
        { value: "T1535", info: "Unused/Unsupported Cloud Regions" },
        { value: "T1550", info: "Use Alternate Authentication Material" },
        { value: "T1078", info: "Valid Accounts" },
        { value: "T1497", info: "Virtualization/Sandbox Evasion" },
        { value: "T1600", info: "Weaken Encryption" },
        { value: "T1220", info: "XSL Script Processing" },
      ],
    },
    {
      group: "Credential Access",
      options: [
        { value: "T1557", info: "Adversary-in-the-Middle" },
        { value: "T1110", info: "Brute Force" },
        { value: "T1555", info: "Credentials from Password Stores" },
        { value: "T1212", info: "Exploitation for Credential Access" },
        { value: "T1187", info: "Forced Authentication" },
        { value: "T1606", info: "Forge Web Credentials" },
        { value: "T1056", info: "Input Capture" },
        { value: "T1556", info: "Modify Authentication Process" },
        { value: "T1111", info: "Multi-Factor Authentication Interception" },
        {
          value: "T1621",
          info: "Multi-Factor Authentication Request Generation",
        },
        { value: "T1040", info: "Network Sniffing" },
        { value: "T1003", info: "OS Credential Dumping" },
        { value: "T1528", info: "Steal Application Access Token" },
        { value: "T1649", info: "Steal or Forge Authentication Certificates" },
        { value: "T1558", info: "Steal or Forge Kerberos Tickets" },
        { value: "T1539", info: "Steal Web Session Cookie" },
        { value: "T1552", info: "Unsecured Credentials" },
      ],
    },
    {
      group: "Discovery",
      options: [
        { value: "T1087", info: "Account Discover" },
        { value: "T1010", info: "Application Window Discovery" },
        { value: "T1217", info: "Browser Information Discovery" },
        { value: "T1580", info: "Cloud Infrastructure Discovery" },
        { value: "T1538", info: "Cloud Service Dashboard" },
        { value: "T1526", info: "Cloud Service Discovery" },
        { value: "T1619", info: "Cloud Storage Object Discovery" },
        { value: "T1613", info: "Container and Resource Discovery" },
        { value: "T1622", info: "Debugger Evasion" },
        { value: "T1652", info: "Device Driver Discovery" },
        { value: "T1482", info: "Domain Trust Discovery" },
        { value: "T1083", info: "File and Directory Discovery" },
        { value: "T1615", info: "Group Policy Discovery" },
        { value: "T1654", info: "Log Enumeration" },
        { value: "T1046", info: "Network Service Discovery" },
        { value: "T1135", info: "Network Share Discovery" },
        { value: "T1040", info: "Network Sniffing" },
        { value: "T1201", info: "Password Policy Discovery" },
        { value: "T1120", info: "Peripheral Device Discovery" },
        { value: "T1069", info: "Permission Groups Discovery" },
        { value: "T1057", info: "Process Discovery" },
        { value: "T1012", info: "Query Registry" },
        { value: "T1018", info: "Remote System Discovery" },
        { value: "T1518", info: "Software Discovery" },
        { value: "T1082", info: "System Information Discovery" },
        { value: "T1614", info: "System Location Discovery" },
        { value: "T1016", info: "System Network Configuration Discovery" },
        { value: "T1049", info: "System Network Connections Discovery" },
        { value: "T1033", info: "System Owner/User Discovery" },
        { value: "T1007", info: "System Service Discovery" },
        { value: "T1124", info: "System Time Discovery" },
        { value: "T1497", info: "Virtualization/Sandbox Evasion" },
      ],
    },
    {
      group: "Lateral Movement	",
      options: [
        { value: "T1210", info: "Exploitation of Remote Services" },
        { value: "T1534", info: "Internal Spearphishing" },
        { value: "T1570", info: "Lateral Tool Transfer" },
        { value: "T1563", info: "Remote Service Session Hijacking" },
        { value: "T1021", info: "Remote Services" },
        { value: "T1091", info: "Replication Through Removable Media" },
        { value: "T1072", info: "Software Deployment Tools" },
        { value: "T1080", info: "Taint Shared Content" },
        { value: "T1550", info: "Use Alternate Authentication Material" },
      ],
    },
    {
      group: "Collection",
      options: [
        { value: "T1557", info: "Adversary-in-the-Middle" },
        { value: "T1560", info: "Archive Collected Data" },
        { value: "T1123", info: "Audio Capture" },
        { value: "T1119", info: "Automated Collection" },
        { value: "T1185", info: "Browser Session Hijacking" },
        { value: "T1115", info: "Clipboard Data" },
        { value: "T1530", info: "Data from Cloud Storage" },
        { value: "T1602", info: "Data from Configuration Repository" },
        { value: "T1213", info: "Data from Information Repositories" },
        { value: "T1005", info: "Data from Local System" },
        { value: "T1039", info: "Data from Network Shared Drive" },
        { value: "T1025", info: "Data from Removable Media" },
        { value: "T1074", info: "Data Staged" },
        { value: "T1114", info: "Email Collection" },
        { value: "T1056", info: "Input Capture" },
        { value: "T1113", info: "Screen Capture" },
        { value: "T1125", info: "Video Capture" },
      ],
    },
    {
      group: "Command and Control",
      options: [
        { value: "T1071", info: "Application Layer Protocol" },
        { value: "T1092", info: "Communication Through Removable Media" },
        { value: "T1659", info: "Content Injection" },
        { value: "T1132", info: "Data Encoding" },
        { value: "T1001", info: "Data Obfuscation" },
        { value: "T1568", info: "Dynamic Resolution" },
        { value: "T1573", info: "Encrypted Channel" },
        { value: "T1008", info: "Fallback Channels" },
        { value: "T1665", info: "Hide Infrastructure" },
        { value: "T1105", info: "Ingress Tool Transfer" },
        { value: "T1104", info: "Multi-Stage Channels" },
        { value: "T1095", info: "Non-Application Layer Protocol" },
        { value: "T1571", info: "Non-Standard Port" },
        { value: "T1572", info: "Protocol Tunneling" },
        { value: "T1090", info: "Proxy" },
        { value: "T1219", info: "Remote Access Software" },
        { value: "T1205", info: "Traffic Signaling" },
        { value: "T1102", info: "Web Service" },
      ],
    },
    {
      group: "Exfiltration",
      options: [
        { value: "T1020", info: "Automated Exfiltration" },
        { value: "T1030", info: "Data Transfer Size Limits" },
        { value: "T1048", info: "Exfiltration Over Alternative Protocol" },
        { value: "T1041", info: "Exfiltration Over C2 Channel" },
        { value: "T1011", info: "Exfiltration Over Other Network Medium" },
        { value: "T1052", info: "Exfiltration Over Physical Medium" },
        { value: "T1567", info: "Exfiltration Over Web Service" },
        { value: "T1029", info: "Scheduled Transfer" },
        { value: "T1537", info: "Transfer Data to Cloud Account" },
      ],
    },
    {
      group: "Impact",
      options: [
        { value: "T1531", info: "Account Access Removal" },
        { value: "T1485", info: "Data Destruction" },
        { value: "T1486", info: "Data Encrypted for Impact" },
        { value: "T1565", info: "Data Manipulation" },
        { value: "T1491", info: "Defacement" },
        { value: "T1561", info: "Disk Wipe" },
        { value: "T1499", info: "Endpoint Denial of Service" },
        { value: "T1657", info: "Financial Theft" },
        { value: "T1495", info: "Firmware Corruption" },
        { value: "T1490", info: "Inhibit System Recovery" },
        { value: "T1498", info: "Network Denial of Service" },
        { value: "T1496", info: "Resource Hijacking" },
        { value: "T1489", info: "Service Stop" },
        { value: "T1529", info: "System Shutdown/Reboot" },
      ],
    },
  ];

export default chipOptions;