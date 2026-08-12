import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType } from 'docx';
import fs from 'fs';
import path from 'path';

// Helper for academic styling
const font = "Calibri";

function p(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      before: options.spaceBefore || 120,
      after: options.spaceAfter || 120,
      line: 280, // 1.15 line spacing
    },
    children: [
      new TextRun({
        text,
        font,
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        italic: options.italic || false,
        color: options.color || "111827",
      }),
    ],
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text,
        font,
        size: 32, // 16pt
        bold: true,
        color: "0F172A",
      }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [
      new TextRun({
        text,
        font,
        size: 28, // 14pt
        bold: true,
        color: "1E293B",
      }),
    ],
  });
}

function codeBlock(text) {
  const lines = text.split('\n');
  return lines.map(line => 
    new Paragraph({
      spacing: { before: 20, after: 20 },
      shading: {
        type: ShadingType.CLEAR,
        fill: "F1F5F9",
      },
      children: [
        new TextRun({
          text: line,
          font: "Consolas",
          size: 18, // 9pt
          color: "334155",
        }),
      ],
    })
  );
}

// Table creation helper
function createTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: "1E293B" },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: h,
              font,
              size: 20, // 10pt
              bold: true,
              color: "FFFFFF",
            }),
          ],
        }),
      ],
    })),
  });

  const bodyRows = rows.map((r, rowIndex) => new TableRow({
    children: r.map(cellText => new TableCell({
      width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: rowIndex % 2 === 0 ? "FFFFFF" : "F8FAFC" },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: cellText,
              font,
              size: 20, // 10pt
              color: "1E293B",
            }),
          ],
        }),
      ],
    })),
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [headerRow, ...bodyRows],
  });
}

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            bottom: 1440,
            left: 1440,
            right: 1440,
          },
        },
      },
      children: [
        heading1("4.11 Operational Decision Support and Notification Mapping Framework"),
        
        heading2("4.11.1 Architectural Rationale and Functional Prototype Implementation"),
        p("The transition of maritime fire protection from isolated mechanical assemblies to networked cyber-physical systems introduces significant data handling challenges within shipboard operational technology environments. Modern intelligent vessels generate a continuous stream of heterogeneous telemetry originating from distributed thermal sensors, optical flame detectors, pressure transducers, programmable logic controllers, industrial Ethernet switches, and intrusion detection engines. While this continuous influx of data provides detailed operational visibility, transmitting unrefined raw signal transitions directly to vessel operators creates severe cognitive overload during emergency conditions. When an actual fire incident or cyber-physical anomaly occurs, alarm flooding often obscures root-cause events, forcing operators to manually synthesize fragmented information under high stress. To validate the practical feasibility of the multi-layered cyber-resilient architecture proposed in this research, a web-based supervisory monitoring and decision-support application named MARISAFE was developed as a functional proof-of-concept prototype."),
        p("The primary architectural rationale for implementing this interactive supervisory system is to demonstrate how high-level operator visibility, contextual decision support, and role-tailored alarm management can be achieved without compromising the deterministic safety control loop. Positioned across the Supervisory Monitoring Layer and the Cyber Resilience Layer, the MARISAFE system acts as an decoupled, non-blocking interface. It ingests validated status signals and security metrics from lower-level programmable logic controllers while remaining strictly separated from the physical actuation logic residing in the Safety Control Zone. Consequently, any software defect, latency spike, or security compromise occurring within the supervisory visualization interface remains functionally isolated, ensuring that deterministic fire detection, interlock execution, and water mist suppression deployment proceed unimpeded at the local controller level in accordance with Safety Integrity Level 3 requirements and SOLAS Chapter II-2 mandates."),
        p("The functional prototype operationalizes the theoretical zone-based defense principles by bifurcating the supervisory interface into two dedicated operational perspectives: an Executive Manager mode and a Technical Engineer SCADA mode. The Executive Manager view aggregates fleet-wide safety ratings, compliance indices, and macro-level compartment health indicators to provide vessel captains and chief officers with immediate situational awareness without surrounding them with low-level electrical or hydraulic diagnostics. Conversely, the Technical Engineer SCADA view exposes granular process telemetry, including 50-millisecond loop scan statuses, Modbus TCP packet integrity rates, dual-PLC hot-swap synchronization states, and section valve line pressures up to 100 bar baseline operating thresholds. By providing distinct, role-specific views bounded by least-privilege access rules, the prototype illustrates how cognitive load can be systematically reduced across different shipboard command ranks. Furthermore, the interactive spatial deck topography embedded within the system provides visual compartment mapping across multiple vessel levels, allowing operators to visually locate thermal anomalies, verify active suppression discharge misting, and review isolated cyber-intrusion events in real time."),

        ...codeBlock(
`+-----------------------------------------------------------------------------------+
|                        SUPERVISORY & DECISION SUPPORT LAYER                       |
|  +-----------------------------------------------------------------------------+  |
|  |                            MARISAFE PROTOTYPE                               |  |
|  |  +----------------------------------+  +---------------------------------+  |  |
|  |  |      Executive Manager View      |  |     Technical SCADA View        |  |  |
|  |  | (Fleet Safety Score, Macro Risk) |  | (50ms Loops, 100 BAR Hydr, IDS) |  |  |
|  |  +----------------------------------+  +---------------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                          ^  (Read-Only Telemetry / Monitored Conduits)
                                          |  (No Direct Unauthenticated Override)
+-----------------------------------------------------------------------------------+
|                            SAFETY CONTROL ZONE (PLC)                              |
|   Deterministic Fire Detection  <--->  Voting Logic (2oo3)  <---> Actuation Logic |
+-----------------------------------------------------------------------------------+`
        ),

        heading2("4.11.2 Event Correlation and Cross-Layer Signal Fusion"),
        p("In complex maritime operational technology environments, individual field alarms rarely occur in isolation during a critical safety or security event. A physical fire in an engine room compartment typically triggers rapid temperature rises, optical flame ionization, localized pressure drops, and automatic section valve actuation simultaneously. Conversely, an industrial cybersecurity incident may involve unauthorized Modbus function code injections, spoofed sensor registers, or network port flooding aimed at blinding the supervisory control platform. If every individual telemetry change is treated as an independent alarm, supervisory workstations are quickly overwhelmed by cascading notification streams. To resolve this structural vulnerability, the decision-support framework integrates a multi-source event correlation and cross-layer signal fusion engine."),
        p("The event correlation engine ingests raw signals from distributed field sensors, controller diagnostic registers, firewall audit logs, and communication switch statistics, processing them through a unified rule-based correlation pipeline. Rather than evaluating telemetry on a point-by-point basis, the engine analyzes spatial, temporal, and functional relationships across adjacent system layers. For instance, when a optical smoke detector triggers in tandem with a rapid thermal gradient increase and a line pressure drop within the engine room lower deck, the correlation engine synthesizes these three discrete observations into a single verified fire emergency incident. Conversely, if a single temperature sensor reports an extreme out-of-range value while adjacent multi-criteria detectors report ambient conditions and network diagnostics indicate packet corruption on an analog input channel, the engine identifies the event as an isolated transducer fault or signal degradation rather than a genuine thermal hazard."),

        ...codeBlock(
`  [ FIELD SENSORS ]       [ PLC DIAGNOSTICS ]       [ CYBER IDS / FW LOGS ]
  (Smoke, Temp, Hydro)    (Scan Time, Sync State)    (Modbus Anomaly, Logins)
           \\                         |                         /
            \\                        |                        /
             v                       v                       v
      +-------------------------------------------------------------+
      |             CROSS-LAYER SIGNAL FUSION ENGINE                |
      |   - Spatial & Temporal Windowing                            |
      |   - Multi-Criteria Verification (Thermal + Optical)         |
      |   - Cyber vs. Physical Anomaly Disambiguation               |
      +-------------------------------------------------------------+
                                     |
                                     v
                  +-----------------------------------+
                  |   SYNTHESIZED INCIDENT CONTEXT    |
                  | (Verified Incident + Priority P1) |
                  +-----------------------------------+`
        ),

        p("This cross-layer signal fusion capability extends directly to cybersecurity anomaly disambiguation. By correlating physical process state changes with network security telemetry, the system can distinguish between pure operational failures, physical safety hazards, and malicious cyber-physical tampering. If an unauthorized attempt is made to alter PLC configuration registers or force a section valve coil over an unencrypted maintenance conduit, the correlation engine cross-references the instruction with the current physical fire state of the associated zone. If no corresponding thermal elevation or flame detection exists within that compartment, the system classifies the event as a potential cybersecurity breach or unauthorized configuration alteration, immediately generating a targeted security alert while locking out remote software overrides. Through this architectural mechanism, event correlation transitions shipboard monitoring from reactive, single-point threshold reporting to context-aware incident intelligence."),

        heading2("4.11.3 Notification Mapping and Role-Based Stakeholder Escalation"),
        p("Following incident synthesis and correlation, the framework routes information through a structured notification mapping engine to ensure that actionable intelligence is delivered strictly to the personnel responsible for mitigating the specific risk. Transmitting technical diagnostic codes to executive command personnel or flooding maintenance staff with strategic vessel readiness metrics degrades operational efficiency. The notification mapping framework addresses this problem by enforcing a strict mapping model governed by Role-Based Access Control and least-privilege principles, aligning event categories with shipboard organizational hierarchies."),
        p("Events are first evaluated by a priority assessment engine that calculates a composite mathematical priority score based on four structural parameters: operational severity, cybersecurity impact, asset criticality, and response urgency. Operational severity quantifies the physical hazard to life and machinery, cybersecurity impact evaluates potential breaches of control integrity or network availability, asset criticality reflects the operational importance of the affected compartment, and response urgency establishes the time sensitivity required for intervention. The resulting priority score assigns the incident to one of four standardized priority tiers, which subsequently dictate the routing path, delivery mechanism, and mandatory acknowledgment windows."),

        createTable(
          ["Priority Tier", "Operational Severity & Impact", "Primary Recipient Role", "Permitted Delivery Channel", "Mandatory Acknowledgment Window"],
          [
            ["Priority Level 1 (P1)", "Informational telemetry, routine system logging, nominal state transitions", "Supervisory Historian, System Audit Log", "Local SCADA Data Log, Silent Event Queue", "N/A (Automated logging)"],
            ["Priority Level 2 (P2)", "Preventive maintenance alerts, minor sensor drift, non-critical hardware warnings", "Maintenance Engineer, Duty Technician", "Maintenance Workstation, Local HMI Diagnostics", "120 Minutes"],
            ["Priority Level 3 (P3)", "Subsystem communication faults, PLC redundancy degradation, active cyber probes", "Chief Engineer, Electrical Officer", "SCADA Alarm Banner, Eng. Control Console", "15 Minutes"],
            ["Priority Level 4 (P4)", "Verified fire emergencies, confirmed 100 BAR suppression discharge, major cyber breaches", "Vessel Captain, Emergency Response Team", "Bridge Command Panel, Audible Annunciators, Cloud Mirror", "Immediate (< 30 Seconds)"]
          ]
        ),

        p("Notification mapping bridges the gap between raw technical system behavior and human command structures. Priority Level 1 events encompass routine operational logs, such as periodic pump state verifications or successful cryptographic key rotations, which are committed directly to immutable audit storage without interrupting duty staff. Priority Level 2 notifications cover scheduled maintenance requirements, such as hydraulic filter replacement warnings or battery backup resistance degradation, and are dispatched exclusively to maintenance engineering terminals. Priority Level 3 events indicate degraded system readiness, including single-channel network switch failures or primary controller failover events, requiring immediate investigation by the Chief Engineer and Senior Automation Officer. Priority Level 4 events denote critical safety emergencies or severe cybersecurity disruptions, such as an active fire in a machinery space or a compromised safety interlock, automatically broadcasting high-decibel visual and audible alerts across the main bridge navigation console and the engine control room simultaneously."),
        p("To prevent unacknowledged critical events from languishing during chaotic onboard situations, the notification mapping architecture incorporates an automated escalation workflow. When a Priority Level 3 or Priority Level 4 notification is issued, an internal timer is initialized within the Cyber Resilience Layer. If the assigned primary stakeholder fails to formally acknowledge the alert on an authorized interface within the defined acknowledgment window, the escalation engine automatically elevates the incident's priority level and re-routes the notification to the next higher level of command authority. For instance, an unacknowledged operational warning regarding section valve pressure loss in an unmanned machinery space will automatically escalate from the duty engineer's console to the Chief Engineer after fifteen minutes, and subsequently to the ship's Captain if unaddressed. All notification distributions, acknowledgments, override attempts, and escalation sequences are logged with microsecond-accurate time stamps to guarantee full post-incident traceability for Port State Control and maritime classification societies."),

        heading2("4.11.4 Cloud Synchronization and Out-of-Band Integrity Verification"),
        p("While onboard operational technology must remain entirely self-sufficient and capable of executing all safety-critical suppression functions during prolonged ocean transits or complete satellite disconnects, modern maritime operations increasingly require off-vessel oversight. Fleet management centers, technical operators, and marine classification authorities require timely visibility into shipboard safety profiles, maintenance states, and cyber-risk postures. The proposed architecture addresses this requirement through a secure cloud notification management module operating at the outermost perimeter of the supervisory layer."),
        p("To preserve network bandwidth and protect shipboard control networks from external attack vectors, the cloud synchronization interface does not expose raw internal Modbus or PROFINET control traffic to the internet. Instead, the onboard event correlation engine processes and compresses local event streams into standardized, cryptographically signed operational incident summaries. Only fully validated, correlated incident packages are forwarded to the secure cloud gateway over outbound-only, TLS 1.3 encrypted conduits. The system enforces an air-gapped architecture where external cloud servers are strictly prohibited from issuing direct control or actuation commands back to onboard programmable logic controllers. Cloud connectivity is confined exclusively to read-only monitoring, diagnostic reporting, and strategic fleet-wide risk aggregation."),

        ...codeBlock(
`+-----------------------------------------------------------------------------------+
|                              ONBOARD VESSEL NETWORK                               |
|                                                                                   |
|  [ Field Sensors & PLCs ] ---> [ Correlation Engine ] ---> [ Outbound Gateway ]   |
|                                                                    |              |
+--------------------------------------------------------------------|--------------+
                                                                     |
                                             Outbound TLS 1.3 Encrypted Pipe
                                             (Zero Direct Inbound PLC Control)
                                                                     |
                                                                     v
+-----------------------------------------------------------------------------------+
|                              OFF-VESSEL CLOUD ENGINE                              |
|                                                                                   |
|  [ Cloud Notification Server ] ---> [ Immutable Audit Store ] ---> [ Fleet Dash ] |
+-----------------------------------------------------------------------------------+`
        ),

        p("Out-of-band integrity verification is embedded within the cloud synchronization pipeline to protect historical log records against tampering during potential cyber incidents. When an operational alarm, configuration alteration, or safety override occurs onboard, the event payload is hashed using SHA-256 and appended to an append-only, cryptographically chained audit log maintained across redundant storage controllers. Simultaneously, a cryptographic hash digest of the log entry is transmitted to off-vessel cloud infrastructure during the next available satellite communication window. In the event that a sophisticated attacker gains local maintenance privileges and attempts to modify or delete historical system logs to conceal malicious activity or operational negligence, discrepancies between the local audit ledger and the off-vessel cryptographic digest immediately trigger an out-of-band security violation alert across the fleet management network."),
        p("Through this combined approach of functional prototype demonstration, cross-layer signal correlation, role-tailored notification mapping, and secure cloud synchronization, the framework bridges the operational gap between lower-level industrial control hardware and top-level human decision-making. The MARISAFE prototype establishes that implementing zero-trust network boundaries, strict role-based data partitioning, and intelligent alarm reduction directly enhances situational awareness for shipboard officers while guaranteeing that safety-critical fire detection and high-pressure water mist suppression functions remain completely deterministic, resilient, and uncompromised."),
      ],
    },
  ],
});

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const buffer = await Packer.toBuffer(doc);
  const filePath = path.join(publicDir, 'Thesis_Chapter_4_11_Operational_Decision_Support.docx');
  fs.writeFileSync(filePath, buffer);
  console.log('Successfully generated DOCX file at:', filePath);
}

main().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
