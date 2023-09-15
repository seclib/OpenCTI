import { describe, expect, it } from 'vitest';
import TurndownService from 'turndown';
import { rssDataParser } from '../../../src/manager/ingestionManager';

// region https://www.oracle.com/ocom/groups/public/@otn/documents/webcontent/rss-otn-sec.xml
const oracleRss = '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n'
    + '<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">\n'
    + '    <channel>\n'
    + '    <title>Oracle Security Alerts</title>\n'
    + '    <link>http://www.oracle.com/technetwork/topics/security/alerts-086861.html</link>\n'
    + '    <description>Security Alerts Issued by Oracle</description>\n'
    + '    <generator>Feeder 2.3.2(1632); Mac OS X Version 10.7.4 (Build 11E53) http://reinventedsoftware.com/feeder/</generator>\n'
    + '    <docs>http://blogs.law.harvard.edu/tech/rss</docs>\n'
    + '    <language>en</language>\n'
    + '    <copyright>Copyright 2023 Oracle. All Rights Reserved.</copyright>\n'
    + '    <managingEditor>otnfeedback_us@oracle.com</managingEditor>\n'
    + '    <pubDate>Tue, 18 Jul 2023 12:30:54 -0700</pubDate>\n'
    + '    <lastBuildDate>Tue, 18 Jul 2023 12:30:54 -0700</lastBuildDate>\n'
    + '<item>\n'
    + '  <title>Oracle Critical Patch Update Advisory - July 2023</title>\n'
    + '  <link rel="test">https://www.oracle.com/security-alerts/cpujul2023.html</link>\n'
    + '  <pubDate>Tue, 18 Jul 2023 12:30:54 -0700</pubDate>\n'
    + '  <guid isPermaLink="false">CPUJul2023</guid>\n'
    + '</item>\n'
    + '</channel>\n'
    + '</rss>';
// endregion

// region https://support.citrix.com/feed/products/all/securitybulletins.rss
const citrixRss = '<?xmlversion="1.0" encoding="UTF-8"?>\n'
    + '<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">\n'
    + '    <channel>\n'
    + '    <title>Citrix Knowledge Center : Security Bulletins</title>\n'
    + '<link>https://support.citrix.com</link>\n'
    + '<description>feed for articles related to knowledge center</description>\n'
    + '<language>en_US</language>\n'
    + '<copyright>1999-2023 Citrix Systems, Inc. All Rights Reserved</copyright>\n'
    + '<dc:language>en_US</dc:language>\n'
    + '<dc:rights>1999-2023 Citrix Systems, Inc. All Rights Reserved</dc:rights>\n'
    + '<item>\n'
    + '  <title>ShareFile StorageZones Controller Security Update for CVE-2023-24489</title>\n'
    + '  <link>https://support.citrix.com/article/CTX559517/sharefile-storagezones-controller-security-update-for-cve202324489</link>\n'
    + '  <description>&lt;p &gt;&lt;span &gt;&lt;b &gt;CTX559517 &lt;/b &gt;&lt;/span &gt;&amp;emsp;&lt;span style=\'padding:10px 10px; background-color:#52DF9D; color:#447f74;\'&gt;New &lt;/span &gt;&lt;/p &gt;&lt;p &gt;ShareFile StorageZones Controller Security Update for CVE-2023-24489 &lt;/p &gt;&lt;p &gt;&lt;span &gt;&lt;i &gt;Applicable Products : &lt;/i &gt;&lt;/span &gt;&amp;emsp;&lt;span &gt;Citrix Content Collaboration &lt;/span &gt;&lt;span &gt;ShareFile &lt;/span &gt;&lt;/p &gt;&lt;/p &gt;</description>\n'
    + '  <category domain="https://support.citrix.com/feed/products">ShareFile</category>\n'
    + '  <category domain="https://support.citrix.com/feed/products">Citrix Content Collaboration</category>\n'
    + '  <pubDate>Thu, 17 Aug 2023 20:40:08 GMT</pubDate>\n'
    + '  <guid isPermaLink="false">https://support.citrix.com/article/CTX559517/sharefile-storagezones-controller-security-update-for-cve202324489</guid>\n'
    + '  <dc:date>2023-08-17T20:40:08Z</dc:date>\n'
    + '</item>\n'
    + '</channel>\n'
    + '</rss>';
// endregion

// region https://cloud.google.com/feeds/google-cloud-security-bulletins.xml
const googleAtom = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<feed xmlns="http://www.w3.org/2005/Atom">\n'
    + '    <id>tag:google.com,2016:google-cloud-security-bulletins</id>\n'
    + '    <title>Google Cloud - Security Bulletins</title>\n'
    + '    <link rel="self" href="https://cloud.google.com/feeds/google-cloud-security-bulletins.xml"/>\n'
    + '    <author>\n'
    + '      <name>Google Cloud</name>\n'
    + '    </author>\n'
    + '    <updated>2023-09-11T14:59:07.818162+00:00</updated>\n'
    + '    <entry>\n'
    + '      <title>GCP-2023-026</title>\n'
    + '      <id>tag:google.com,2016:google-cloud-security-bulletins#gcp-2023-026</id>\n'
    + '      <updated>2023-09-11T14:59:07.818162+00:00</updated>\n'
    + '      <link rel="alternate" href="https://cloud.google.com/support/bulletins/index#gcp-2023-026"/>\n'
    + '      <content type="html"><![CDATA[<p><strong>Published:</strong> 2023-09-06</p><h3 class="hide-from-toc" data-text="Description" id="description">Description</h3><table>\n'
    + '        <thead>\n'
    + '        <tr>\n'
    + '          <th width="70%">Description</th>\n'
    + '          <th>Severity</th>\n'
    + '          <th>Notes</th>\n'
    + '        </tr>\n'
    + '        </thead>\n'
    + '        <tbody>\n'
    + '        <tr>\n'
    + '          <td><p></p><p>Three vulnerabilities (CVE-2023-3676, CVE-2023-3955, CVE-2023-3893) have been discovered in Kubernetes where a user that can create Pods on Windows nodes may be able to escalate to admin privileges on those nodes. These vulnerabilities affect the Windows versions of Kubelet and the Kubernetes CSI proxy.</p> <p>For instructions and more details, see the following bulletins:</p> <ul><li><a href="https://cloud.google.com/anthos/clusters/docs/security-bulletins#gcp-2023-026-gke">GKE security bulletin</a></li>\n'
    + '            <li><a href="https://cloud.google.com/anthos/clusters/docs/security-bulletins#gcp-2023-026-anthosvmware">Anthos clusters on VMware security bulletin</a></li>\n'
    + '            <li><a href="https://cloud.google.com/anthos/clusters/docs/security-bulletins#gcp-2023-026-anthosaws">Anthos clusters on AWS security bulletin</a></li>\n'
    + '            <li><a href="https://cloud.google.com/anthos/clusters/docs/security-bulletins#gcp-2023-026-anthosazure">Anthos on Azure security bulletin</a></li>\n'
    + '            <li><a href="https://cloud.google.com/anthos/clusters/docs/security-bulletins#gcp-2023-026-anthosbm">Anthos on bare metal security bulletin</a></li></ul></td>\n'
    + '          <td>High</td>\n'
    + '          <td><a class="external" href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-3676">CVE-2023-3676</a>, <a class="external" href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-3955">CVE-2023-3955</a>, <a class="external" href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2023-3893"> CVE-2023-3893</a></td>\n'
    + '        </tr>\n'
    + '        </tbody>\n'
    + '      </table>]]>\n'
    + '        </content>\n'
    + '    </entry>\n'
    + '</feed>';
// endregion

// region https://securelist.com/category/apt-reports/feed/
const secureList = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"\n'
    + 'xmlns:content="http://purl.org/rss/1.0/modules/content/"\n'
    + 'xmlns:wfw="http://wellformedweb.org/CommentAPI/"\n'
    + 'xmlns:dc="http://purl.org/dc/elements/1.1/"\n'
    + 'xmlns:atom="http://www.w3.org/2005/Atom"\n'
    + 'xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"\n'
    + 'xmlns:slash="http://purl.org/rss/1.0/modules/slash/" >\n'
    + '\n'
    + '    <channel>\n'
    + '    <title>APT reports &#8211; Securelist</title>\n'
    + '<atom:link href="https://securelist.com/category/apt-reports/feed/" rel="self" type="application/rss+xml" />\n'
    + '<link>https://securelist.com</link>\n'
    + '<description></description>\n'
    + '<lastBuildDate>Thu, 10 Aug 2023 08:57:25 +0000</lastBuildDate>\n'
    + '<language>en-US</language>\n'
    + '<sy:updatePeriod>\n'
    + '  hourly\t</sy:updatePeriod>\n'
    + '<sy:updateFrequency>\n'
    + '  1\t</sy:updateFrequency>\n'
    + '<generator>https://wordpress.org/?v=6.2.2</generator>\n'
    + '\n'
    + '<image>\n'
    + '  <url>https://securelist.com/wp-content/themes/securelist2020/assets/images/content/site-icon.png</url>\n'
    + '  <title>APT reports &#8211; Securelist</title>\n'
    + '  <link>https://securelist.com</link>\n'
    + '  <width>32</width>\n'
    + '  <height>32</height>\n'
    + '</image>\n'
    + '<item>\n'
    + '  <title>Focus on DroxiDat/SystemBC</title>\n'
    + '  <link>https://securelist.com/focus-on-droxidat-systembc/110302/</link>\n'
    + '  <comments>https://securelist.com/focus-on-droxidat-systembc/110302/#respond</comments>\n'
    + '\n'
    + '  <dc:creator><![CDATA[Kurt Baumgartner]]></dc:creator>\n'
    + '  <pubDate>Thu, 10 Aug 2023 10:00:22 +0000</pubDate>\n'
    + '  <category><![CDATA[APT reports]]></category>\n'
    + '  <category><![CDATA[Backdoor]]></category>\n'
    + '  <category><![CDATA[Malware Descriptions]]></category>\n'
    + '  <category><![CDATA[Malware-as-a-Service]]></category>\n'
    + '  <category><![CDATA[Ransomware]]></category>\n'
    + '  <category><![CDATA[Targeted attacks]]></category>\n'
    + '  <category><![CDATA[APT (Targeted attacks)]]></category>\n'
    + '  <category><![CDATA[Industrial threats]]></category>\n'
    + '  <guid isPermaLink="false">https://kasperskycontenthub.com/securelist/?p=110302</guid>\n'
    + '\n'
    + '  <description><![CDATA[An unknown actor targeted an electric utility in southern Africa with Cobalt Strike beacons and DroxiDat, a new variant of the SystemBC payload. We speculate that this incident was in the initial stages of a ransomware attack. ]]></description>\n'
    + '  <content:encoded><![CDATA[<p><img width="990" height="400" src="https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2022/07/28105711/abstract_dangerous_box-990x400.jpg" class="attachment-securelist-huge-promo size-securelist-huge-promo wp-post-image" alt="" decoding="async" /></p><p>Recently we pushed a report to our customers about an interesting and common component of the cybercrime malware set &#8211; SystemBC. And, in much the same vein as the 2021 Darkside Colonial Pipeline incident, we found a new SystemBC variant deployed to a critical infrastructure target. This time, the proxy-capable backdoor was deployed alongside Cobalt Strike beacons in a south African nation&#8217;s critical infrastructure.</p>\n'
    + '    <p>Kim Zetter closely reviewed the preceding Colonial Pipeline incident in her <a href="https://www.youtube.com/watch?v=noNx1Dmo3K0" target="_blank" rel="noopener">BlackHat 2022 keynote</a> &#8220;Pre-Stuxnet, Post-Stuxnet: Everything Has Changed, Nothing Has Changed&#8221;, calling it a &#8220;watershed moment&#8221;. We are now seeing targeting and tactical similarities elsewhere in the world.</p>\n'
    + '    <p>A lot of abstract content and interesting <a href="https://www.dragos.com/blog/ransomware-attack-analysis-q1-2023/" target="_blank" rel="noopener">trend</a> <a href="https://www.dragos.com/blog/dragos-industrial-ransomware-attack-analysis-q2-2023/" target="_blank" rel="noopener">analysis</a> has been published about industrial ransomware attacks &#8220;The second quarter of 2023 proved to be an exceptionally active period for ransomware groups, posing significant threats to industrial organizations and infrastructure&#8221;, but very little technical detail in the way of particular electric utility ransomware incidents has been publicly reported. We know that surveyed utilities, on a global basis, are <a href="https://assets.siemens-energy.com/siemens/assets/api/uuid:c723efb9-847f-4a33-9afa-8a097d81ae19/siemens-cybersecurity.pdf" target="_blank" rel="noopener">reporting more and more in the way of targeted activity</a> and higher risk: &#8220;56% [of respondents] report at least one attack involving a loss of private information or an outage in the OT environment in the past 12 months&#8221;. While not all of the activity is attributed to ransomware actors, perhaps the relevant ransomware attackers are avoiding retaliation by strong government agencies and alliances, while continuing to act on a game plan that demonstrated previous successes. Regardless, this increased utilities targeting is a real world problem with serious potential consequences, especially in areas where network outages may affect customers on a country-wide basis.</p>\n'
    + '    <p>Notably, an unknown actor targeted an electric utility in southern Africa with Cobalt Strike beacons and DroxiDat, a new variant of the SystemBC payload. We speculate that this incident was in the initial stages of a ransomware attack. This attack occurred in the third and fourth week of March 2023, as a part of a small wave of attacks involving both DroxiDat and CobaltStrike beacons across the world. DroxiDat, a lean ~8kb variant of SystemBC serving as a system profiler and simple SOCKS5-capable bot, was detected in the electric utility. The C2 infrastructure for this electric utility incident involved an energy-related domain &#8220;powersupportplan[.]com&#8221; that resolved to an already suspicious IP host. This host was previously used several years prior as a part of an APT activity, raising the potential for an APT-related targeted attack. While our interest was piqued, a link to that previous APT was never established, and was likely unrelated. Ransomware was not delivered to the organization, and we do not have enough information to precisely attribute this activity. However, in a healthcare related incident involving DroxiDat around the same timeframe, Nokoyawa ransomware was delivered, along with several other incidents involving CobaltStrike sharing the same license_id and staging directories, and/or C2.</p>\n'
    + '    <h2 id="droxidat-systembc-technical-details">DroxiDat/SystemBC Technical Details</h2>\n'
    + '    <p>The DroxiDat/SystemBC payload component is interesting in its own right as a changing, malicious backdoor, often used as a part of ransomware incidents. Multiple &#8220;types&#8221; of SystemBC have been <a href="https://asec.ahnlab.com/en/33600/" target="_blank" rel="noopener">publicly catalogued</a>. The SystemBC platform has been offered for sale on various underground forums at least since 2018 as a &#8220;malware as a service,&#8221; or <a href="https://securelist.com/malware-as-a-service-market/109980/" target="_blank" rel="noopener">MaaS</a>. This platform is made up of three separate parts: on the server side, a C2 web server with admin panel and a C2 proxy listener; on the target side is a backdoor payload. Regarding an earlier SystemBC variant, other researchers have stated that &#8220;<a href="https://news.sophos.com/en-us/2020/12/16/systembc/" target="_blank" rel="noopener">SystemBC is an attractive tool</a> in these types of operations because it allows for multiple targets to be worked at the same time with automated tasks, allowing for hands-off deployment of ransomware using Windows built-in tools if the attackers gain the proper credentials.&#8221;</p>\n'
    + '    <p>This DroxiDat variant is very compact compared to previous and common 15-30kb+ SystemBC variants. Detected SystemBC objects going back to at least 2018 (a SystemBC executable compiled in July 2017 was observed) have numbered in the thousands and were used by a long list of ransomware affiliates. In fact, it appears that most of the functionality provided in previous SystemBC payloads was stripped from its codebase, and the purpose of this DroxiDat malware variant is a simple system profiler &#8211; its file name suggests its use case as &#8220;syscheck.exe&#8221;. It provides no download-and-execute capabilities, but can connect with remote listeners and pass data back and forth, and modify the system registry. Also interesting, within this power generator network, DroxiDat/systemBC was detected exclusively on system assets similar to past DarkSide targets. And, a <a href="https://threatpost.com/ransomware-attacks-major-utilities/163687/" target="_blank" rel="noopener">Darkside affiliate</a> hit Electrobras and Copel energy companies in Brazil in 2021. The combination of C:\\perflogs for storage with DroxiDat/SystemBC and CobaltStrike executable objects was used in past <a href="https://news.sophos.com/en-us/2020/12/08/egregor-ransomware-mazes-heir-apparent/" target="_blank" rel="noopener">Egregor</a> and <a href="https://news.sophos.com/en-us/2020/10/14/inside-a-new-ryuk-ransomware-attack/" target="_blank" rel="noopener">Ryuk</a> incidents as well.</p>\n'
    + '    <table>\n'
    + '      <tr>\n'
    + '        <td><strong>MD5</strong></td>\n'
    + '        <td>8d582a14279920af10d37eae3ff2b705</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>SHA1</strong></td>\n'
    + '        <td>f98b32755cbfa063a868c64bd761486f7d5240cc</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>SHA256</strong></td>\n'
    + '        <td>a00ca18431363b32ca20bf2da33a2e2704ca40b0c56064656432afd18a62824e</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>Link time</strong></td>\n'
    + '        <td>Thu, 15 Dec 2022 06:34:16 UTC</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>File type</strong></td>\n'
    + '        <td>PE32 executable (GUI) Intel 80386, for MS Windows</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>File size</strong></td>\n'
    + '        <td>8192 bytes</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>File path</strong></td>\n'
    + '        <td>C:\\<strong>perflogs\\syscheck.exe</strong></td>\n'
    + '      </tr>\n'
    + '    </table>\n'
    + '    <p>Two instances of this DroxiDat malware appeared in C:\\<strong>perflogs</strong> alongside two Cobalt Strike beacons on multiple systems.<br />\n'
    + '      Essentially, this variant provides several functions:</p>\n'
    + '    <ul>\n'
    + '      <li>Retrieves active machine name/username, local IP and volume serial information.</li>\n'
    + '      <li>Instead of creating an exclusive-use mutex, it checks and then creates a new thread and registers a window, class &#8220;Microsoft&#8221; and text &#8220;win32app&#8221; (included in all variants of systemBC).</li>\n'
    + '      <li>Simple xor decrypts its C2 (IP:port) settings and creates a session to the remote host.</li>\n'
    + '      <li>Encrypts and sends collected system information to the C2.</li>\n'
    + '      <li>May create and delete registry keys and values.</li>\n'
    + '    </ul>\n'
    + '    <p>Missing from this Windows variant that is common to past variants:</p>\n'
    + '    <ul>\n'
    + '      <li>File creation capability.</li>\n'
    + '      <li>File-execution switch statement, parsing for hardcoded file extensions (vbs, cmd, bat, exe, ps1) and code execution functionality.</li>\n'
    + '      <li>Mini-TOR client capabilities.</li>\n'
    + '      <li>Emisoft anti-malware scan.</li>\n'
    + '    </ul>\n'
    + '    <p>The object contains xor-encoded configuration settings:<br />\n'
    + '      <code>XOR KEY: 0xB6108A9DB511264DB3FAFDB74F3D7F22ECCFC2683755966371A3974A1EA15A074404D96B6510CEE6<br />\n'
    + '        HOST1: 93.115.25.41<br />\n'
    + '        HOST2: 192.168.1.28<br />\n'
    + '        PORT1: 443</code></p>\n'
    + '    <p>So in this case, its immediate C2 destination is 93.115.25.41:443<br />\n'
    + '      Up until November 2022, this IP host provided bitcoin services. Ownership likely changed in December 2022, as the above backdoor was compiled mid-December.<br />\n'
    + '      A second DroxiDat executable was sent down to the same systems with capabilities to add executable entries to the &#8220;Software\\Microsoft\\Windows\\CurrentVersion\\Run&#8221; registry key with a &#8220;socks5&#8221; entry, i.e.:</p><pre class="crayon-plain-tag">powershell.exe -windowstyle hidden -Command "c:\\perflogs\\hos.exe"</pre><p> </p>\n'
    + '    <p>A third DroxiDat object, this time a dll, was sent down to a server.</p>\n'
    + '    <table>\n'
    + '      <tr>\n'
    + '        <td><strong>MD5</strong></td>\n'
    + '        <td>1957deed26c7f157cedcbdae3c565cff</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>SHA1</strong></td>\n'
    + '        <td>be9e23e56c4a25a8ea453c093714eed5e36c66d0</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>SHA256</strong></td>\n'
    + '        <td>926fcb9483faa39dd93c8442e43af9285844a1fbbe493f3e4731bbbaecffb732</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>Link time</strong></td>\n'
    + '        <td>Thu, 15 Dec 2022 06:07:31 UTC</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>File type</strong></td>\n'
    + '        <td>PE32 executable (DLL) (GUI) Intel 80386, for MS Windows</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td><strong>File size</strong></td>\n'
    + '        <td>7168 bytes</td>\n'
    + '      </tr>\n'
    + '      <tr>\n'
    + '        <td></strong>File path</strong></td>\n'
    + '    <td>c:\\<strong>perflogs</strong>\\svch.dll</td>\n'
    + '  </tr>\n'
    + '</table>\n'
    + '<p>It implements essentially the same functionality as &#8220;syscheck.exe&#8221; above without the ability to modify the registry. It also maintains the same HOST and PORT values, and 40-byte key.</p>\n'
    + '<h2 id="cobalt-strike-beacons-and-related-infrastructure">Cobalt Strike beacons and related infrastructure</h2>\n'
    + '<p>Cobalt Strike beacons were detected on these systems as well, located in the same directory and similar infrastructure. In a couple of instances, the beacons arrived and were detected on the same day as DroxiDat. In several instances, a couple of the beacons first arrived and were detected in the same perflogs directory two days later, and several more six days later. It&#8217;s highly likely that the same attackers maintained access via stolen credentials or another unknown method.</p>\n'
    + '<p>The beacons&#8217; infrastructure was power-utility themed:<br />\n'
    + '  <code>powersupportplan[.]com, 179.60.146.6<br />\n'
    + '    URL: /rs.css, /skin</code></p>\n'
    + '<p>Several beacons calling back to this C2 included the same license_id value:<br />\n'
    + '  <code>"license_id": "0x282d4156"</code></p>\n'
    + '<p>We identified one other Cobalt Strike C2 server and beacon cluster, possibly spoofing a power-utility theme as well, along with other related data points: <code>epowersoftware[.]com, 194.165.16.63.</code></p>\n'
    + '<p>The ssh server on this epowersoftware host shares the same ssh version and RSA key(s) with the one at powersupportplan[.]com. Additionally, the CS beacon calling back to this domain maintains the same license_id, as seen above: &#8220;license_id&#8221;: &#8220;0x282d4156&#8221;.</p>\n'
    + '<h2 id="attribution">Attribution</h2>\n'
    + '<p>We have a consistent set of data points across multiple incidents mentioned in our private report, helping suggest an assessment may be made with low confidence. Several of these suggest this activity may be attributed to Russian-speaking RaaS cybercrime. In this case, we may be looking at an activity from a group known as Pistachio Tempest or FIN12, a group HHS <a href="https://www.hhs.gov/sites/default/files/ransomware-trends-q1-2022.pdf" target="_blank" rel="noopener">reported</a> &#8220;has specifically targeted the healthcare industry&#8221; in 2022, frequently deploying SystemBC alongside CS Beacon to deploy ransomware:</p>\n'
    + '<ul>\n'
    + '  <li>Consistent use of the same perflogs staging directory across this intrusion set within an early 2023 timeframe.</li>\n'
    + '  <li>SystemBC consistently paired alongside Cobalt Strike.</li>\n'
    + '  <li>Shared profile data across Cobalt Strike hosts.</li>\n'
    + '  <li>Nokoyawa ransomware deployment alongside DroxiDat within a health care organization early 2023.</li>\n'
    + '</ul>\n'
    + '<p>More details can be found in our private crimeware intelligence report &#8220;Focus on DroxiDat/SystemBC &#8211; Unknown Actor Targets Power Generator with DroxiDat and CobaltStrike&#8221; released in June 2023.</p>\n'
    + '<h2 id="reference-ioc">Reference IoC</h2>\n'
    + '<h3 id="domains-and-ip">Domains and IP</h3>\n'
    + '<p>93.115.25.41<br />\n'
    + '  powersupportplan[.]com, 179.60.146.6</p>\n'
    + '<p><strong>Likely related</strong><br />\n'
    + '  epowersoftware[.]com, 194.165.16.63</p>\n'
    + '<h3 id="file-hash">File hash</h3>\n'
    + '<p><strong>Droxidat</strong><br />\n'
    + '  8d582a14279920af10d37eae3ff2b705<br />\n'
    + '  f98b32755cbfa063a868c64bd761486f7d5240cc<br />\n'
    + '  a00ca18431363b32ca20bf2da33a2e2704ca40b0c56064656432afd18a62824e</p>\n'
    + '<p><strong>CobaltStrike beacon</strong><br />\n'
    + '  19567b140ae6f266bac6d1ba70459fbd<br />\n'
    + '  fd9016c64aea037465ce045d998c1eead3971d35<br />\n'
    + '  a002668f47ff6eb7dd1b327a23bafc3a04bf5208f71610960366dfc28e280fe4</p>\n'
    + '<h3 id="file-paths-related-objects">File paths, related objects</h3>\n'
    + '<p>C:\\perflogs\\syscheck.exe<br />\n'
    + '  C:\\perflogs\\a.dll<br />\n'
    + '  C:\\perflogs\\hos.exe<br />\n'
    + '  C:\\perflogs\\host.exe<br />\n'
    + '  C:\\perflogs\\hostt.exe<br />\n'
    + '  C:\\perflogs\\svch.dll<br />\n'
    + '  C:\\perflogs\\svchoct.dll<br />\n'
    + '  C:\\perflogs\\admin\\svcpost.dll<br />\n'
    + '  C:\\perflogs\\admin\\syscheck.exe<br />\n'
    + '  C:\\perflogs\\sk64.dll<br />\n'
    + '  C:\\perflogs\\clinic.exe</p>\n'
    + '<p><a href="https://www.proofpoint.com/us/threat-insight/post/systembc-christmas-july-socks5-malware-and-exploit-kits" target="_blank" rel="noopener">SystemBC is like Christmas in July for SOCKS5 Malware and Exploit Kits</a><br />\n'
    + '  <a href="https://news.sophos.com/en-us/2020/10/14/inside-a-new-ryuk-ransomware-attack/" target="_blank" rel="noopener">They&#8217;re back: inside a new Ryuk ransomware attack</a></p>\n'
    + ']]></content:encoded>\n'
    + '\n'
    + '<wfw:commentRss>https://securelist.com/focus-on-droxidat-systembc/110302/feed/</wfw:commentRss>\n'
    + '<slash:comments>0</slash:comments>\n'
    + '\n'
    + '\n'
    + '<media:content xmlns:media="http://search.yahoo.com/mrss/" url="https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2022/07/28105711/abstract_dangerous_box.jpg" width="1200" height="675"><media:keywords>full</media:keywords></media:content>\n'
    + '<media:content xmlns:media="http://search.yahoo.com/mrss/" url="https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2022/07/28105711/abstract_dangerous_box-1024x576.jpg" width="1024" height="576"><media:keywords>large</media:keywords></media:content>\n'
    + '<media:content xmlns:media="http://search.yahoo.com/mrss/" url="https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2022/07/28105711/abstract_dangerous_box-300x169.jpg" width="300" height="169"><media:keywords>medium</media:keywords></media:content>\n'
    + '<media:content xmlns:media="http://search.yahoo.com/mrss/" url="https://media.kasperskycontenthub.com/wp-content/uploads/sites/43/2022/07/28105711/abstract_dangerous_box-150x150.jpg" width="150" height="150"><media:keywords>thumbnail</media:keywords></media:content>\n'
    + '</item>\n'
    + '</channel>\n'
    + '</rss>';
// endregion

describe('Rss parsing testing', () => {
  it('should oracleRss 2.0 parsed correctly', async () => {
    const turndownService = new TurndownService();
    const items = await rssDataParser(turndownService, oracleRss, undefined);
    expect(items.length).toBe(1);
  });
  it('should citrixRss 2.0 parsed correctly', async () => {
    const turndownService = new TurndownService();
    const items = await rssDataParser(turndownService, citrixRss, undefined);
    expect(items.length).toBe(1);
    expect(items[0].labels.length).toBe(2);
    expect(items[0].labels).toEqual(['ShareFile', 'Citrix Content Collaboration']);
  });
  it('should googleAtom 1.0 parsed correctly', async () => {
    const turndownService = new TurndownService();
    const items = await rssDataParser(turndownService, googleAtom, undefined);
    expect(items.length).toBe(1);
    expect(items[0].labels.length).toBe(0);
  });
  it('should secureList 2.0 parsed correctly', async () => {
    const turndownService = new TurndownService();
    const items = await rssDataParser(turndownService, secureList, undefined);
    expect(items.length).toBe(1);
    expect(items[0].labels.length).toBe(8);
    expect(items[0].link).toBe('https://securelist.com/focus-on-droxidat-systembc/110302/');
    expect(items[0].description).toBe('An unknown actor targeted an electric utility in southern Africa with Cobalt Strike beacons and DroxiDat, a new variant of the SystemBC payload. We speculate that this incident was in the initial stages of a ransomware attack.');
    expect(items[0].content).toBeDefined();
  });
});
