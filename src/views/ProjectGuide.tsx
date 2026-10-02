import { motion } from 'framer-motion';
import { BookOpen, Database, Code2, Layers, Cpu, CheckSquare, Github, Layout, Terminal, ListChecks } from 'lucide-react';

const sections = [
  {
    id: "01",
    title: "Project Guidance",
    icon: BookOpen,
    content: (
      <div className="space-y-12">
        <p className="text-black/60 italic leading-loose text-lg">
          During the project-related sessions, we were guided through the complete development of a full-stack web application, covering both theoretical concepts and practical implementation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-black/[0.02] p-8 border-l-4 border-black/5">
            <h4 className="font-serif italic font-black text-2xl mb-6 flex items-center gap-3">
              <Terminal size={20} className="text-[#F27D26]" />
              Backend Evolution
            </h4>
            <p className="text-[12px] uppercase tracking-widest font-mono text-black/50 leading-relaxed font-bold">
              We used Spring Boot 4.0 to build RESTful APIs, implementing robust endpoints for CRUD operations. The architecture follows a strict Controller → Service → Repository paradigm with full Dependency Injection.
            </p>
          </div>
          
          <div className="bg-black/[0.02] p-8 border-l-4 border-black/5">
            <h4 className="font-serif italic font-black text-2xl mb-6 flex items-center gap-3">
              <Layout size={20} className="text-[#F27D26]" />
              Frontend Logic
            </h4>
            <p className="text-[12px] uppercase tracking-widest font-mono text-black/50 leading-relaxed font-bold">
              React was utilized to build dynamic, responsive interfaces. Integration with backend APIs was handled via Axios, ensuring real-time data flow and synchronized client-side state management.
            </p>
          </div>
        </div>

        <div className="border border-black/10 p-12 bg-white shadow-xl shadow-black/[0.02]">
          <h4 className="label-mono mb-8 text-[#F27D26]">Stack Configuration_</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div>
              <p className="font-serif italic font-black text-xl mb-4 underline decoration-black/5 underline-offset-4">Logic.</p>
              <ul className="text-[10px] font-mono text-black/40 space-y-3 uppercase tracking-widest font-bold">
                <li>Spring Boot / Security</li>
                <li>JPA / Hibernate</li>
                <li>JUnit 5 / Mockito</li>
                <li>Swagger / OpenAPI</li>
              </ul>
            </div>
            <div>
              <p className="font-serif italic font-black text-xl mb-4 underline decoration-black/5 underline-offset-4">Presentation.</p>
              <ul className="text-[10px] font-mono text-black/40 space-y-3 uppercase tracking-widest font-bold">
                <li>React / Hooks</li>
                <li>React Router</li>
                <li>Tailwind CSS</li>
                <li>Vite / Axial</li>
              </ul>
            </div>
            <div>
              <p className="font-serif italic font-black text-xl mb-4 underline decoration-black/5 underline-offset-4">Persistence.</p>
              <ul className="text-[10px] font-mono text-black/40 space-y-3 uppercase tracking-widest font-bold">
                <li>MySQL / PostgreSQL</li>
                <li>ORM Operations</li>
                <li>Transaction Mgmt</li>
                <li>Schema Mapping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "02",
    title: "Problem Statement",
    icon: ListChecks,
    content: (
      <div className="space-y-10">
        <p className="text-xl font-serif italic text-black leading-relaxed">
          Design and develop a scalable and efficient full-stack web application to manage core business operations such as product management, customer handling, and order processing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-y border-black/10 py-16">
          <div className="space-y-6">
            <h5 className="label-mono text-[#F27D26]">The Objective_</h5>
            <p className="text-[11px] text-black/50 leading-loose uppercase tracking-[0.05em] font-medium italic">
              The system should provide a seamless user experience enabling registration, login, product browsing, and order placement through a responsive frontend. The backend must expose secure RESTful APIs to handle business logic and communication.
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="label-mono text-[#F27D26]">Technical Mandate_</h5>
            <p className="text-[11px] text-black/50 leading-loose uppercase tracking-[0.05em] font-medium italic">
              Proper data validation, error handling, and role-based access control must be maintained within a layered architecture. Support for CRUD, efficient retrieval, and real-time JSON interaction is paramount.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "03",
    title: "System Execution",
    icon: Cpu,
    content: (
      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-black/10 border border-black/10">
          {[
            { step: "01", label: "Analysis", desc: "Project scope and feature identification." },
            { step: "02", label: "Schema", desc: "Database modeling and relationship mapping." },
            { step: "03", label: "Backend", desc: "Entity classes, Repositories, and Services." },
            { step: "04", label: "API Test", desc: "CRUD testing via Postman/OpenAPI." },
            { step: "05", label: "Frontend", desc: "UI design and state management logic." },
            { step: "06", label: "Synthesis", desc: "Connecting React with Spring Boot endpoints." },
            { step: "07", label: "Validation", desc: "JSR-303 and client-side form hardening." },
            { step: "08", label: "Audit", desc: "Unit testing and performance optimization." },
            { step: "09", label: "Execution", desc: "Full-stack deployment and verification." }
          ].map((item) => (
            <div key={item.step} className="bg-white p-10 hover:bg-black group transition-all">
              <p className="font-mono text-[10px] text-[#F27D26] mb-4 font-black">STEP_{item.step}</p>
              <h5 className="font-serif italic font-black text-2xl text-black group-hover:text-white mb-4">{item.label}.</h5>
              <p className="text-[10px] uppercase font-mono text-black/40 group-hover:text-white/40 tracking-widest leading-relaxed font-bold">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-black text-white p-16 shadow-2xl shadow-black/20">
          <h4 className="label-mono mb-10 text-white/40">Architectural Schematics_</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-6">
              <p className="font-serif italic font-black text-2xl">High-Level Flow.</p>
              <p className="font-mono text-xs text-white/30 tracking-widest leading-loose">
                REACT CLIENT <span className="text-[#F27D26]">⇄</span> REST API (JSON) <span className="text-[#F27D26]">⇄</span> SPRING BOOT <span className="text-[#F27D26]">⇄</span> JPA/ORM <span className="text-[#F27D26]">⇄</span> MYSQL
              </p>
            </div>
            <div className="space-y-8">
              <p className="font-serif italic font-black text-2xl text-[#F27D26]">Folder Hierarchy.</p>
              <div className="font-mono text-[10px] text-white/40 space-y-2 uppercase tracking-widest overflow-x-auto whitespace-nowrap scrollbar-hide">
                <p>src/components/ (Navbar, Cards, UI)</p>
                <p>src/pages/ (Home, Checkout, Auth)</p>
                <p>src/services/ (Axios API Workers)</p>
                <p>src/App.js (Router & State)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "04",
    title: "Registry Topics",
    icon: Github,
    content: (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          "Retail Billing", "Queue Mgmt", "Home Service", "Turf Mgmt",
          "Bookstore App", "Mental Health", "Crime Detection", "Civic Connect",
          "E-commerce", "Finance Mgmt", "Car Rental", "Smart Recipe",
          "Exam Portal", "LMS / ATS", "Used Car Auction", "Pharmacy Sys"
        ].map((topic, i) => (
          <div key={i} className="border border-black/5 bg-black/[0.01] p-6 text-center hover:bg-white hover:border-black/20 transition-all cursor-default">
            <p className="font-mono text-[9px] text-black/30 mb-2 font-bold">TOPIC_{String(i+1).padStart(2, '0')}</p>
            <p className="font-serif italic font-black text-sm text-black">{topic}</p>
          </div>
        ))}
      </div>
    )
  }
];

export default function ProjectGuide() {
  return (
    <div className="max-w-6xl mx-auto space-y-32 mb-32">
      <header className="border-b-8 border-black pb-12">
        <p className="label-mono mb-4 text-[#F27D26]">Manuscript_ 2026-A</p>
        <h1 className="text-9xl font-serif italic font-black text-black leading-none mb-6">Specification.</h1>
        <p className="text-black/40 font-mono text-xs uppercase tracking-[0.4em] italic font-bold">Complete Project Genesis & Architectural Blueprint_</p>
      </header>

      <div className="space-y-32">
        {sections.map((section, index) => (
          <motion.section 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start"
          >
            <div className="lg:col-span-4 sticky top-40">
              <div className="space-y-6">
                <div className="bg-black text-white w-14 h-14 flex items-center justify-center mb-8">
                  <section.icon size={28} className="stroke-[2]" />
                </div>
                <p className="font-mono text-[10px] text-black/30 font-black tracking-[0.3em]">FRAGMENT_{section.id}</p>
                <h2 className="text-6xl font-serif italic font-black text-black leading-none underline decoration-black/5 decoration-4 underline-offset-8">
                  {section.title}.
                </h2>
              </div>
            </div>
            <div className="lg:col-span-8 pt-6">
              {section.content}
            </div>
          </motion.section>
        ))}
      </div>

      <footer className="border-t border-black/10 pt-20 text-center">
        <p className="font-mono text-[10px] text-black/20 uppercase tracking-[0.5em] font-black italic">End of Technical Registry / Verified 2024_</p>
      </footer>
    </div>
  );
}
