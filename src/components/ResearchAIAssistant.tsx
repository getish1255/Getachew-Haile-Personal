import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, FileText, Check, Copy, ArrowRight, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_QUERIES = [
  'How does Getachew model rainwater harvesting suitability in Arsi Zone?',
  'What ICT modernization and infrastructure programs did he lead at IQQO?',
  'What was his research methodology on ECONAT organic fertilizer on tef?',
  'What are Getachew’s technical competencies in GIS, Python, and PostGIS?',
];

interface ResearchAIAssistantProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const ResearchAIAssistant: React.FC<ResearchAIAssistantProps> = ({ isModal = false, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'proposal'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am the AI Research Assistant on Getachew Haile’s official portfolio. I am grounded in his 15+ years of institutional ICT leadership at IQQO, published research in rainwater harvesting, soil fertility, and geospatial modeling. How can I assist your research or institutional inquiry?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Proposal brief state
  const [proposalTopic, setProposalTopic] = useState('Digital Soil Mapping & Smallholder Fertilizer Recommendation');
  const [proposalOrg, setProposalOrg] = useState('International Agricultural Research Center');
  const [proposalIntent, setProposalIntent] = useState('Joint Grant & Earth Observation Deployment');
  const [generatedBrief, setGeneratedBrief] = useState<string>('');
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);

  const handleSendMessage = async (userText?: string) => {
    const textToSend = userText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    setInputMessage('');
    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/research-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'No response returned.' }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            'Getachew Haile is the Director of the ICT Directorate and GIS & Remote Sensing Researcher at IQQO with over 15 years of experience in spatial decision support, rainwater harvesting, soil fertility mapping, and enterprise IT. You can reach him directly at boqolo@gmail.com.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!proposalTopic.trim() || isGeneratingBrief) return;
    setIsGeneratingBrief(true);
    setGeneratedBrief('');

    try {
      const res = await fetch('/api/gemini/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: proposalTopic,
          organization: proposalOrg,
          intent: proposalIntent,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setGeneratedBrief(data.brief || 'Unable to generate brief.');
    } catch (err: any) {
      console.error('Proposal error:', err);
      setGeneratedBrief(
        `### Research Collaboration Brief\n\n**Focus Area:** ${proposalTopic}\n**Partner:** ${proposalOrg}\n\n**Synopsis:** This project integrates Getachew Haile's expertise in spatial multi-criteria evaluation (AHP), Earth Observation (Landsat/Sentinel), and IQQO's ground-truthed agricultural data network. Core pillars include satellite data ingestion, spatial database structuring, and field validation.\n\n*Inquire directly at boqolo@gmail.com.*`
      );
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleCopyBrief = () => {
    if (!generatedBrief) return;
    navigator.clipboard.writeText(generatedBrief);
    setBriefCopied(true);
    setTimeout(() => setBriefCopied(false), 2000);
  };

  const content = (
    <div className="flex flex-col h-full max-h-[82vh]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Ask Getachew’s Research Assistant</span>
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Gemini 3.8 Flash
              </span>
            </h3>
            <p className="text-xs text-slate-400">Grounded in verified CV, research papers & ICT leadership</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'chat' ? 'bg-emerald-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Research Q&A
          </button>
          <button
            onClick={() => setActiveTab('proposal')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'proposal' ? 'bg-emerald-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Draft Proposal
          </button>
        </div>

        {isModal && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 ml-2 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        )}
      </div>

      {activeTab === 'chat' ? (
        <div className="flex flex-col flex-1 min-h-0 pt-4">
          {/* Preset question pills */}
          <div className="pb-3 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
            {PRESET_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-left px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:text-emerald-300 hover:border-slate-700 whitespace-nowrap shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div key={idx} className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed whitespace-pre-wrap ${
                      isAssistant
                        ? 'bg-slate-900 border border-slate-800 text-slate-200'
                        : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-100'
                    }`}
                  >
                    {m.content}
                  </div>
                  {!isAssistant && (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
                <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Analyzing Getachew’s research outputs...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-3 border-t border-slate-800 mt-3 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask about publications, GIS methodology, AHP modeling, or ICT leadership..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 disabled:opacity-50 disabled:pointer-events-none transition-colors font-medium shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Proposal Generator Tab */
        <div className="flex flex-col flex-1 min-h-0 pt-4 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          <p className="text-slate-300 leading-relaxed">
            Generate an executive 3-part research collaboration brief bridging Getachew Haile’s geospatial and ICT
            expertise with your organization’s initiatives.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Research Topic</label>
              <input
                type="text"
                value={proposalTopic}
                onChange={(e) => setProposalTopic(e.target.value)}
                placeholder="e.g. Rainwater Harvesting & Drought Resilience"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Organization / Institution</label>
              <input
                type="text"
                value={proposalOrg}
                onChange={(e) => setProposalOrg(e.target.value)}
                placeholder="e.g. University, Development Agency, NGO"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Collaboration Intent</label>
            <input
              type="text"
              value={proposalIntent}
              onChange={(e) => setProposalIntent(e.target.value)}
              placeholder="e.g. Joint Grant Application, Technical Advisory, Field Pilot"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleGenerateProposal}
            disabled={isGeneratingBrief || !proposalTopic.trim()}
            className="w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2"
          >
            {isGeneratingBrief ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Formulating Research Concept Note...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Collaborative Concept Note</span>
              </>
            )}
          </button>

          {generatedBrief && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Draft Research Brief</span>
                </span>
                <button
                  onClick={handleCopyBrief}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 transition-colors"
                >
                  {briefCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                {generatedBrief}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
        <div className="w-full max-w-2xl p-6 rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl h-[85vh] flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/90 shadow-xl h-full flex flex-col">
      {content}
    </div>
  );
};
