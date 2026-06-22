import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { messageAPI } from "../../services/api";
import { motion } from "framer-motion";
import { Send, MessageCircle, ArrowLeft, Search } from "lucide-react";

const Messages = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    loadConversations();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv._id);
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => loadMessages(activeConv._id), 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeConv?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await messageAPI.getConversations();
      setConversations(data);
    } catch {}
  };

  const loadMessages = async (convId) => {
    try {
      const data = await messageAPI.getMessages(convId);
      setMessages(data);
    } catch {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    try {
      await messageAPI.sendMessage(activeConv.otherUser._id, newMsg.trim());
      setNewMsg("");
      loadMessages(activeConv._id);
      loadConversations();
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const cardClass = `rounded-2xl shadow-lg backdrop-blur-sm border transition-all ${
    darkMode ? "bg-slate-900/60 border-slate-700/50" : "bg-white/70 border-white"
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-rose-50 text-slate-900"}`}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600 mb-6"
        >
          Messages
        </motion.h1>

        <div className={`${cardClass} flex overflow-hidden`} style={{ height: "calc(100vh - 200px)" }}>
          {/* Sidebar */}
          <div className={`w-80 flex-shrink-0 border-r flex flex-col ${darkMode ? "border-slate-700" : "border-slate-200"} ${activeConv ? "hidden md:flex" : "flex"}`}>
            <div className="p-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${darkMode ? "bg-slate-800/50" : "bg-slate-100"}`}>
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle size={40} className="mx-auto text-slate-400 mb-3" />
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    No conversations yet. Respond to a blood request to start messaging.
                  </p>
                </div>
              ) : (
                filteredConvs.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => setActiveConv(c)}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all ${
                      activeConv?._id === c._id
                        ? darkMode ? "bg-slate-800" : "bg-rose-50"
                        : darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      c.otherUser?.role === "Hospital" ? "bg-purple-500" : "bg-red-500"
                    }`}>
                      {c.otherUser?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm truncate">{c.otherUser?.name}</p>
                        {c.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{c.unreadCount}</span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {c.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!activeConv ? "hidden md:flex" : "flex"}`}>
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className={`px-4 py-3 border-b flex items-center gap-3 ${darkMode ? "border-slate-700 bg-slate-900/80" : "border-slate-200 bg-white/80"}`}>
                  <button onClick={() => setActiveConv(null)} className="md:hidden">
                    <ArrowLeft size={20} />
                  </button>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    activeConv.otherUser?.role === "Hospital" ? "bg-purple-500" : "bg-red-500"
                  }`}>
                    {activeConv.otherUser?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{activeConv.otherUser?.name}</p>
                    <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {activeConv.otherUser?.role}
                      {activeConv.otherUser?.hospitalName ? ` • ${activeConv.otherUser.hospitalName}` : ""}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => {
                    const isMe = m.sender?._id === user?._id;
                    return (
                      <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          isMe
                            ? "bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-br-md"
                            : darkMode
                            ? "bg-slate-800 text-white rounded-bl-md"
                            : "bg-slate-100 text-slate-900 rounded-bl-md"
                        }`}>
                          <p>{m.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? "text-white/60" : darkMode ? "text-slate-500" : "text-slate-400"}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className={`p-3 border-t flex gap-2 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type a message..."
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                      darkMode ? "bg-slate-800/50 border border-slate-700 focus:border-red-500/50" : "bg-slate-100 border border-slate-200 focus:border-rose-300"
                    }`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={sending || !newMsg.trim()}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl disabled:opacity-50"
                  >
                    <Send size={18} />
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle size={60} className={`mx-auto mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
                  <p className={`font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
