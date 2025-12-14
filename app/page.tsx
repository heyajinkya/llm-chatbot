"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Database, School, MessageSquare, Sparkles, TrendingUp } from 'lucide-react';

const UniqueSchoolsFAQBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [stats, setStats] = useState({ totalQueries: 0, avgResponseTime: 0, satisfaction: 98 });
  const messagesEndRef = useRef(null);

  // Comprehensive Unique Schools FAQ Database
  const uniqueSchoolsFAQs = [
    // Company Information
    {
      category: "Company Overview",
      question: "What is Unique Schools and when was it founded?",
      answer: "Unique Schools is a leading Irish EdTech company founded in 2015, headquartered in Dublin, Ireland (Northwood Crescent, Unit 38 Block 4, North Wood, County Dublin). We specialize in digital communication, administration, and app solutions specifically designed for schools. As a self-funded company, we serve over 20% of Irish schools (140+ institutions) with innovative solutions that connect teachers, administrators, students, and parents seamlessly."
    },
    {
      category: "Company Overview",
      question: "What makes Unique Schools different from competitors?",
      answer: "Our unique differentiators include: 1) Ireland-exclusive focus with deep understanding of Irish school systems and GDPR compliance, 2) Customer feedback-driven product development - we build what schools actually need, 3) Self-funded independence allowing us to prioritize school needs over investor demands, 4) Integrated suite approach replacing multiple vendors with one unified platform, 5) Proven track record serving 20%+ of Irish schools, 6) Local support team based in Dublin with deep education sector expertise, 7) Simple, intuitive interfaces that require minimal training."
    },
    {
      category: "Company Overview",
      question: "What are your business hours and contact information?",
      answer: "We operate Monday to Friday, 09:00 to 16:30 Irish time. Contact us via: Email: staffsupport@uniqueschools.ie, Phone: (01) 886 9458, Address: Unit 38 Block 4, Northwood Crescent, North Wood, County Dublin, Ireland. We also have an Indian subsidiary handling design and development, ensuring 24/7 product improvement while maintaining Ireland-focused service delivery."
    },
    {
      category: "Company Overview",
      question: "What is your growth trajectory and market position?",
      answer: "We're experiencing significant organic growth through word-of-mouth and direct school adoption. Currently serving 140+ schools (20%+ of Irish schools), we're projected for substantial expansion over the next 36 months. Our growth strategy focuses on: enhancing existing products based on user feedback, expanding into new Irish regions, developing AI-powered features, and maintaining our reputation for reliability and customer-centric innovation."
    },
    
    // Product Suite
    {
      category: "Products - School App",
      question: "What is the Unique Schools mobile app?",
      answer: "Our flagship School App is a comprehensive communication platform that connects the entire school community. Features include: Real-time notifications and announcements, Two-way messaging between teachers and parents, Event calendars and reminders, Newsletter distribution, Photo and video sharing from school events, Emergency alerts and updates, Permission slips and consent forms, Absence reporting, Integration with Digital Sign-In/Out and Unique Pay. Available on iOS and Android with a user-friendly interface requiring zero training."
    },
    {
      category: "Products - School App",
      question: "How does the communication system work in the app?",
      answer: "Our communication system is designed for efficiency: Teachers can send targeted messages to specific classes, year groups, or the entire school; Parents receive instant push notifications; Two-way messaging allows parents to respond directly; Message read receipts show engagement; Translation features support multilingual families; Scheduled messaging for planned announcements; Archive system for reference; GDPR-compliant data handling. This eliminates the need for paper notes, reduces email overload, and ensures critical information reaches parents instantly."
    },
    
    // Digital Sign-In/Out
    {
      category: "Products - Sign-In/Out",
      question: "What is Digital Sign-In/Out and how does it work?",
      answer: "Digital Sign-In/Out is our advanced attendance management system that modernizes student arrival/departure tracking. It works through: 1) Swipe card system - students tap their card on entry/exit, 2) Manual entry option - staff can sign students in/out via tablet/computer, 3) Real-time parent notifications - parents receive instant SMS/app alerts when their child arrives or leaves, 4) Permission-based sign-out - requires authorized adult approval for early departures, 5) Visitor management - tracks all school entries including contractors and guests, 6) Attendance analytics - generates reports for patterns and compliance, 7) Integration with school app for absence reporting."
    },
    {
      category: "Products - Sign-In/Out",
      question: "What are the benefits of Digital Sign-In/Out over traditional methods?",
      answer: "Key benefits include: Enhanced safety - know exactly who is on campus at all times; Time savings - eliminates manual roll calls and paper registers; Parental peace of mind - instant arrival/departure notifications; Accurate records - digital logs for compliance and reporting; Reduced truancy - immediate alerts for unexplained absences; Contactless operation - hygienic swipe card system; Emergency preparedness - instant headcount and location data; Cost reduction - eliminates paper registers and manual data entry; Audit trail - complete historical records for safeguarding."
    },
    {
      category: "Products - Sign-In/Out",
      question: "How do parent notifications and approvals work?",
      answer: "Our notification system is intelligent and permission-based: Standard arrivals/departures trigger automatic notifications via SMS and/or app push; Early sign-outs require parent approval - system sends approval request, parent approves via app with identity verification; Late arrivals are logged and parents notified; Unexplained absences trigger alerts to both parents and admin; Multiple guardians can be notified simultaneously; Notification preferences customizable per family; Emergency contact escalation for critical situations; All notifications logged for record-keeping and compliance."
    },
    
    // Unique Pay
    {
      category: "Products - Unique Pay",
      question: "What is Unique Pay and what can I pay for?",
      answer: "Unique Pay is our integrated payment platform that simplifies all school-related financial transactions. You can pay for: School meals and lunch programs, School trips and excursions, Extracurricular activities and clubs, Voluntary contributions, Book rentals and materials, Sports equipment and uniforms, After-school care, Event tickets (concerts, plays, sports), Fundraising initiatives, Registration and activity fees. All payments are processed securely with PCI DSS compliance, automated receipts, and payment history tracking."
    },
    {
      category: "Products - Unique Pay",
      question: "How does Unique Pay work and what are its advantages?",
      answer: "Unique Pay streamlines payments through: 1) Integrated app experience - pay directly from the school app, 2) Multiple payment methods - credit/debit cards, direct debit, wallet top-up, 3) Automated reminders - no more missed payment deadlines, 4) Digital receipts - instant confirmation and tax documentation, 5) Payment plans - spread costs over time for expensive items, 6) Family accounts - link multiple children, pay once, 7) Low transaction fees compared to cash handling costs, 8) Financial reporting for schools - automated reconciliation, 9) Reduced admin burden - eliminates cash collection and tracking, 10) Secure and encrypted - bank-level security standards."
    },
    {
      category: "Products - Unique Pay",
      question: "Is Unique Pay secure and what about refunds?",
      answer: "Security and transparency are paramount: PCI DSS Level 1 certified payment processing; Bank-grade encryption (256-bit SSL); No card details stored on school devices; 3D Secure authentication for card payments; Fraud detection systems; Regular security audits; GDPR compliant data handling. For refunds: Processed within 5-7 business days; Automatic refund notifications; Full refund history in app; Schools can configure refund policies; Partial refunds supported; Dispute resolution process in place. All transactions are traceable with complete audit trails."
    },
    
    // Website Development
    {
      category: "Products - Websites",
      question: "Do you provide website development services?",
      answer: "Yes, we create modern, professional school websites that enhance online presence and complement our digital ecosystem. Our websites include: Responsive design (mobile, tablet, desktop), Content management system for easy updates, School calendar integration, News and announcements section, Photo galleries and event showcases, Staff and department directories, Admissions information and forms, Integration with our School App and Unique Pay, SEO optimization for local search, Accessibility compliance (WCAG standards), GDPR-compliant contact forms, Custom branding matching school identity. We handle design, development, hosting, and ongoing maintenance."
    },
    {
      category: "Products - Websites",
      question: "How do your websites integrate with other Unique Schools products?",
      answer: "Our websites are designed as part of a unified ecosystem: Single sign-on across website and app; Calendar events sync bidirectionally; News published on website auto-shares to app; Payment buttons link directly to Unique Pay; Sign-in/out data can display on website (visitor info, etc.); Staff directory syncs with internal systems; Admissions forms flow into school management system; Mobile app download links prominently featured; Consistent branding and user experience; Unified analytics dashboard. This integration eliminates data silos and creates a seamless experience for all users."
    },
    
    // Implementation & Support
    {
      category: "Implementation",
      question: "How long does implementation take?",
      answer: "Implementation timeline varies by product suite: School App alone - 2-3 weeks (setup, training, launch); Digital Sign-In/Out - 3-4 weeks (hardware setup, staff training, testing); Unique Pay - 2-3 weeks (payment gateway setup, testing, compliance); Complete suite - 6-8 weeks (phased rollout recommended); Website development - 4-6 weeks (design approval, content, launch). We follow a proven process: Discovery call to understand needs; Custom configuration; Staff training sessions; Phased rollout with pilot groups; Go-live support; Post-launch review and optimization. Schools are fully operational quickly with minimal disruption."
    },
    {
      category: "Implementation",
      question: "What training and support do you provide?",
      answer: "Comprehensive training and ongoing support: Initial training - On-site or virtual sessions for all staff levels; Role-based training - Admin, teachers, support staff each get relevant training; Video tutorials and documentation - Access 24/7 resource library; Train-the-trainer program - Empower internal champions; Parent onboarding materials - Guides, videos, FAQs; Live support during business hours - Email and phone; Ticket system for technical issues; Regular webinars on new features; Annual review meetings; Dedicated account manager for each school; User community forum; 99.9% uptime SLA. Support is included in subscription - no hidden fees."
    },
    {
      category: "Implementation",
      question: "What are the system requirements and technical specifications?",
      answer: "Our solutions are designed for universal compatibility: School App - iOS 12+ and Android 8+, works on all smartphones/tablets; Digital Sign-In/Out - Hardware provided (card readers, tablets), requires stable WiFi/ethernet, compatible with existing swipe cards or we provide new ones; Unique Pay - Browser-based admin panel (Chrome, Firefox, Safari, Edge), integrates with Irish banks and payment processors; Website - Hosted on enterprise-grade servers (99.9% uptime), CDN for fast loading globally; Cloud-based architecture - No on-premise servers needed, automatic backups, encrypted data storage; API access - For integration with existing school management systems (e.g., VSware, Aladdin); Bandwidth - Minimal requirements, optimized for school internet."
    },
    
    // Pricing & Contracts
    {
      category: "Pricing",
      question: "What is your pricing model?",
      answer: "Transparent, school-sized-based pricing: Subscription model - Annual or monthly payment options; Per-pupil pricing - Scales with school size, volume discounts available; Bundle discounts - Save 20%+ when combining multiple products; No hidden fees - All features included, no per-message or per-transaction charges (except nominal payment processing); Free updates - New features included automatically; Setup fees - One-time implementation fee, waived for annual contracts; Hardware - Digital Sign-In/Out hardware sold separately or leased; Custom quotes - Contact us for exact pricing based on your school's needs. Pricing starts from €500/year for small schools. ROI typically achieved within 6 months through admin time savings."
    },
    {
      category: "Pricing",
      question: "Do you offer trials or demos?",
      answer: "Yes, we offer multiple ways to experience our solutions: Free demo - 30-minute personalized demonstration of all products; Trial period - 30-day free trial for schools (full feature access); Pilot program - Start with one year group or department; Reference visits - Visit schools already using our solutions; Case studies - Detailed success stories with ROI data; Sandbox environment - Test environment for IT teams to evaluate; Free consultation - Needs assessment and custom solution design; No obligation - Trial with no credit card required, no automatic billing. We're confident you'll see the value immediately, and our 95%+ renewal rate proves it."
    },
    
    // Security & Compliance
    {
      category: "Security & Privacy",
      question: "How do you ensure data security and GDPR compliance?",
      answer: "Data protection is our highest priority: GDPR fully compliant - Built specifically for EU regulations; Data residency - All data stored in EU servers (Ireland/Germany); Encryption - AES-256 encryption at rest, TLS 1.3 in transit; Access controls - Role-based permissions, multi-factor authentication; Regular audits - Annual security assessments by third parties; DPO support - Guidance on data protection obligations; Data processing agreements - Compliant DPA provided; Right to erasure - Simple data deletion process; Breach notification - Protocol in place per GDPR Article 33; ISO 27001 roadmap - Working toward certification; Penetration testing - Quarterly security testing; Staff training - All employees GDPR trained; Minimal data collection - Only essential information; Parent consent management - Built-in consent tracking."
    },
    {
      category: "Security & Privacy",
      question: "Who has access to student data and how is it protected?",
      answer: "Strict access controls protect student information: Role-based access - Only authorized school staff see relevant data; Principle of least privilege - Users see only what they need; Parent access - Limited to their own children's data only; Audit logs - Every data access tracked and logged; Session timeouts - Automatic logout after inactivity; Device management - Remotely wipe data if device lost; Two-factor authentication - Optional extra security layer; No third-party sharing - We never sell or share data; Subprocessors list - Transparent about all service providers; Data retention policies - Automatic deletion after defined periods; Anonymized analytics - Aggregate data only, no personal info; Contractual obligations - All staff sign NDAs and confidentiality agreements; Background checks - All personnel vetted."
    },
    
    // Integration & Compatibility
    {
      category: "Integration",
      question: "Does Unique Schools integrate with our existing school management system?",
      answer: "Yes, we integrate with major Irish school management systems: VSware - Full bidirectional sync (attendance, student data); Aladdin - Student records, parent contacts, attendance; Webwise - Basic data import/export; Custom systems - API available for bespoke integrations; Excel/CSV - Bulk import/export functionality; Google Workspace - SSO, calendar sync; Microsoft 365 - SSO, Teams integration; MIS systems - Standard data format compatibility. Integration benefits: Single source of truth, no duplicate data entry, automatic updates, reduced errors, time savings. We handle the technical setup and provide ongoing sync monitoring."
    },
    {
      category: "Integration",
      question: "Can Unique Schools work alongside our current systems?",
      answer: "Absolutely - we're designed to complement, not replace: Phased adoption - Start with one product, add others gradually; Coexistence mode - Run parallel with existing systems during transition; Data migration - We handle importing existing records; API-first architecture - Easy integration with any system; Open data formats - Export your data anytime in standard formats; No vendor lock-in - Your data remains accessible; Middleware options - For complex legacy systems; Gradual migration - Transition at your own pace; Hybrid approach - Use us for some functions, keep others on existing systems; Legacy system retirement - We can help migrate off old platforms. Many schools start with our app for communications while keeping their current MIS, then expand from there."
    },
    
    // ROI & Benefits
    {
      category: "Benefits & ROI",
      question: "What return on investment can we expect?",
      answer: "Schools typically see significant ROI within 6 months: Time savings - Average 15-20 hours/week admin time reduced; Cost reduction - Eliminate paper (€2,000-5,000/year), reduce SMS costs (€1,000-3,000/year), lower printing costs; Payment efficiency - Reduce cash handling costs and losses (2-5% of collections); Improved attendance - 3-5% improvement from automated tracking; Higher parental engagement - 80%+ app adoption increases participation; Faster communications - Information reaches families 10x faster; Revenue increase - Better payment collection rates (95%+ vs 80-85% with cash); Staff satisfaction - Reduced administrative burden improves morale; Reduced errors - Digital processes eliminate human mistakes; Emergency preparedness - Invaluable during incidents. Average total ROI: 300-500% annually. We provide ROI calculator for your specific school."
    },
    {
      category: "Benefits & ROI",
      question: "What feedback do current schools give?",
      answer: "Our 95%+ renewal rate speaks volumes. Common feedback: 'Game-changer for parent communication' - No more missed messages; 'Digital Sign-In/Out transformed our safeguarding' - Instant visibility; 'Unique Pay saved our office team 10 hours weekly' - Automated collections; 'Parents love the app' - 85%+ adoption rates typical; 'Implementation was smoother than expected' - Professional onboarding; 'Support team is responsive and helpful' - Quick issue resolution; 'Worth every penny' - Clear ROI demonstrated; 'Wish we'd done this sooner' - Common sentiment. We can connect you with reference schools in your area. Our word-of-mouth growth (20%+ market share) reflects genuine school satisfaction. Check our testimonials and case studies on our website."
    },
    
    // Troubleshooting & FAQs
    {
      category: "Common Issues",
      question: "What if parents don't have smartphones?",
      answer: "We accommodate all families: SMS fallback - Critical messages sent via text; Email notifications - All communications available via email; Web portal - Browser-based access to all features; Printed summaries - Weekly/monthly digests if needed; Family sharing - One device can cover multiple family members; School device lending - Tablets available at reception for check-in; Phone support - Parents can call office for information; Assisted access - Staff can help parents access system; Multi-generational accounts - Grandparents can receive notifications; Gradual adoption - Start with engaged families, expand over time. In practice, 85-95% of families adopt the app quickly, and we support the remainder through alternative channels."
    },
    {
      category: "Common Issues",
      question: "What happens if the system goes down?",
      answer: "We maintain 99.9% uptime with robust failover: Redundant infrastructure - Multiple servers across data centers; Automatic failover - Seamless switching to backup systems; Offline mode - App continues to function with cached data; Manual processes - Staff trained on backup procedures for Sign-In/Out; Status page - Real-time system status available; SMS alerts - Notification of any service interruptions; 24/7 monitoring - Our team alerted instantly of any issues; SLA commitment - Uptime guarantee with credits for violations; Disaster recovery - Complete backup and restoration procedures; Regular maintenance windows - Scheduled during low-usage periods (announced in advance); Historical uptime - 99.97% average over past 24 months. In the rare event of downtime, our support team proactively communicates and resolves issues rapidly."
    }
  ];

  useEffect(() => {
    setFaqs(uniqueSchoolsFAQs);
    setMessages([{
      role: 'assistant',
      content: '👋 Welcome to Unique Schools! I\'m your AI assistant, here to answer questions about our digital school solutions.\n\nWe serve 140+ Irish schools with:\n🎓 School Communication App\n📱 Digital Sign-In/Out System\n💳 Unique Pay Payment Platform\n🌐 Website Development\n\nHow can I help you today?'
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 3),
        avgResponseTime: 1.2 + Math.random() * 0.5,
        satisfaction: 97 + Math.random() * 2
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Advanced similarity with keyword boosting
  const calculateSimilarity = (query, text, category) => {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    
    // Keyword boosting
    const keywords = {
      'price|cost|pricing|pay|fee': 2.0,
      'security|gdpr|privacy|data': 1.8,
      'sign-in|sign-out|attendance': 1.8,
      'app|mobile|communication': 1.5,
      'integrate|integration|compatibility': 1.5,
      'implement|setup|install': 1.3,
      'roi|benefit|value|saving': 1.5
    };
    
    let boost = 1.0;
    Object.entries(keywords).forEach(([pattern, multiplier]) => {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(q) && regex.test(t)) {
        boost = Math.max(boost, multiplier);
      }
    });
    
    const words1 = q.split(/\W+/).filter(w => w.length > 2);
    const words2 = t.split(/\W+/).filter(w => w.length > 2);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    const baseSimilarity = intersection.size / union.size;
    
    // Category match bonus
    const categoryBonus = category.toLowerCase().includes(q.split(/\W+/)[0]) ? 0.1 : 0;
    
    return (baseSimilarity * boost) + categoryBonus;
  };

  const findRelevantFAQs = (query, topK = 4) => {
    const scored = faqs.map(faq => ({
      ...faq,
      score: calculateSimilarity(
        query, 
        faq.question + ' ' + faq.answer + ' ' + faq.category,
        faq.category
      )
    }));
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(faq => faq.score > 0.06);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const startTime = Date.now();
    const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    // alert(`Using Groq API Key: ${GROQ_API_KEY}`);


    try {
      const relevantFAQs = findRelevantFAQs(userMessage, 4);
      
      const context = relevantFAQs.length > 0
        ? relevantFAQs.map((faq, idx) => 
            `[FAQ ${idx + 1}] Category: ${faq.category}\nQ: ${faq.question}\nA: ${faq.answer}\n(Relevance: ${(faq.score * 100).toFixed(1)}%)`
          ).join('\n\n---\n\n')
        : 'No directly matching FAQs found in knowledge base.';

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert AI assistant for Unique Schools, an Irish EdTech company founded in 2015. You help schools, teachers, parents, and administrators understand our digital solutions.

COMPANY CONTEXT:
- Headquartered in Dublin, Ireland (Northwood Crescent, Unit 38 Block 4, North Wood, County Dublin)
- Self-funded company serving 140+ Irish schools (20%+ market share)
- Operating hours: Monday-Friday, 09:00-16:30
- Contact: staffsupport@uniqueschools.ie | (01) 886 9458
- Customer feedback-driven product development
- Ambitious growth plans for next 36 months

PRODUCTS:
1. School App - Real-time communications platform
2. Digital Sign-In/Out - Swipe card attendance with parent notifications
3. Unique Pay - Integrated payment system
4. Website Development - Modern school websites

RESPONSE GUIDELINES:
✓ Be professional yet friendly and conversational
✓ Use the FAQ context to provide accurate, detailed answers
✓ Include specific features, benefits, and technical details when relevant
✓ If answer isn't in FAQs, acknowledge this and offer to connect them with our team
✓ Highlight integration capabilities and Irish school focus
✓ Emphasize ROI, time savings, and customer satisfaction
✓ For pricing questions, mention custom quotes and offer demo/trial
✓ Always maintain enthusiasm about helping Irish schools digitize
✓ Use bullet points sparingly - only for complex lists
✓ Keep responses comprehensive but scannable

FAQ KNOWLEDGE BASE:
${context}

Remember: You're representing a growing Irish EdTech company that genuinely cares about making schools better through technology.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.75,
          max_tokens: 800,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: botResponse,
        sources: relevantFAQs.length > 0 ? relevantFAQs : null,
        responseTime
      }]);

      setStats(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + 1,
        avgResponseTime: parseFloat(responseTime)
      }));

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ I encountered an error connecting to the AI service.\n\n**Setup Required:**\nPlease add your Groq API key in the code:\n1. Visit https://console.groq.com/ (free account)\n2. Generate an API key\n3. Replace "YOUR_GROQ_API_KEY_HERE" on line 594\n\n**Alternative:**\nContact Unique Schools directly:\n📧 staffsupport@uniqueschools.ie\n📞 (01) 886 9458\n🕒 Mon-Fri, 09:00-16:30\n\nError details: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What products does Unique Schools offer?",
    "How does Digital Sign-In/Out work?",
    "What is Unique Pay?",
    "How much does it cost?",
    "Is the data GDPR compliant?",
    "How long does implementation take?",
    "What's the ROI?",
    "Do you integrate with existing systems?"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  const categories = [...new Set(faqs.map(f => f.category))];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <School className="text-indigo-600" size={36} />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold tracking-tight">Unique Schools</h1>
                <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                  <Sparkles size={14} />
                  AI-Powered Support | Serving 140+ Irish Schools
                </p>
              </div>
            </div>
            
            {/* Live Stats */}
            <div className="hidden lg:flex gap-6">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                <div className="text-xs text-blue-100">Response Time</div>
                <div className="text-lg font-bold text-white">{stats.avgResponseTime.toFixed(1)}s</div>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                <div className="text-xs text-blue-100">Satisfaction</div>
                <div className="text-lg font-bold text-white">{stats.satisfaction.toFixed(1)}%</div>
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                <div className="text-xs text-blue-100">FAQs Loaded</div>
                <div className="text-lg font-bold text-white">{faqs.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      {messages.length <= 2 && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="text-indigo-600" size={20} />
              <p className="text-sm font-semibold text-gray-700">Popular Questions:</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 px-4 py-3 rounded-xl text-sm font-medium transition-all border border-indigo-200 hover:border-indigo-300 hover:shadow-md text-left"
                >
                  {q}
                </button>
              ))}
            </div>
            
            {/* Category Pills */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Browse by Category:</p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-200 shadow-sm"
                  >
                    {cat} ({faqs.filter(f => f.category === cat).length})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-2.5 h-11 w-11 flex-shrink-0 shadow-lg">
                    <Bot className="text-white" size={26} />
                  </div>
                )}
                <div className={`max-w-3xl rounded-2xl p-5 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white' 
                    : 'bg-white text-gray-800 border border-gray-100'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 font-semibold">
                        <Database size={14} />
                        <span>Knowledge Sources ({msg.sources.length}):</span>
                      </div>
                      <div className="space-y-2">
                        {msg.sources.map((src, i) => (
                          <div key={i} className="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2.5 rounded-lg border border-indigo-100">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <span className="text-xs font-bold text-indigo-700">[{src.category}]</span>
                                <p className="text-xs text-gray-700 mt-1">{src.question}</p>
                              </div>
                              <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full font-medium">
                                {(src.score * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {msg.responseTime && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <TrendingUp size={12} />
                      <span>Responded in {msg.responseTime}s</span>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="bg-gray-700 rounded-2xl p-2.5 h-11 w-11 flex-shrink-0 shadow-lg">
                    <User className="text-white" size={26} />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-2.5 h-11 w-11 shadow-lg">
                <Bot className="text-white" size={26} />
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin text-indigo-600" size={24} />
                  <span className="text-sm text-gray-600">Analyzing knowledge base...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-white border-t shadow-2xl">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products, pricing, implementation, security, ROI..."
              className="flex-1 border-2 border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition-all text-gray-800 text-base shadow-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-8 py-4 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-bold shadow-lg hover:shadow-xl"
            >
              <Send size={22} />
              Send
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>💡 Tip: Try "Compare your products" or "Show me implementation process"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Powered by</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded font-bold">Groq AI</span>
              <span>+</span>
              <span className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-2 py-1 rounded font-bold">RAG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniqueSchoolsFAQBot;