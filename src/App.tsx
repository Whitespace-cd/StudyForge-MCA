// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
//  CONFIG — change these 3 lines only
// ═══════════════════════════════════════════════════════
const CONFIG = {
  OWNER_EMAIL: "your@email.com",       // ← YOUR email → auto-admin on register
  OWNER_PASSWORD: "admin@studyforge",  // ← YOUR admin password
  RAZORPAY_KEY: "rzp_test_XXXX",       // ← paste Razorpay key here
  ANTHROPIC_KEY: "",                   // ← paste Anthropic key OR leave blank (users add own)
  FREE_AI_LIMIT: 5,
  PRO_PRICE: 9900,
  PRO_PRICE_DISPLAY: "₹99",
};

// ── SUBJECTS ────────────────────────────────────────────
const SUBJECTS = [
  { id:"ds",    code:"DS",     title:"Data Structures & Algorithms",   color:"#00c9a7", icon:"🌲",
    units:[
      {id:"ds1",unit:1,title:"Linear Data Structures",topics:[
        {id:"ds1t1",title:"Abstract Data Types (ADT)",marks:[2,5]},
        {id:"ds1t2",title:"Stack & Applications",marks:[2,5,10,13]},
        {id:"ds1t3",title:"Queue & Circular Queue",marks:[2,5,10,13]},
        {id:"ds1t4",title:"Linked Lists",marks:[5,10,13]},
      ]},
      {id:"ds2",unit:2,title:"Non-Linear Data Structures",topics:[
        {id:"ds2t1",title:"Binary Tree & Traversals",marks:[2,5,10,13]},
        {id:"ds2t2",title:"BST & AVL Tree",marks:[5,10,13]},
        {id:"ds2t3",title:"Huffman Algorithm",marks:[5,10,13]},
      ]},
      {id:"ds3",unit:3,title:"Graphs",topics:[
        {id:"ds3t1",title:"Graph Representation & Traversals",marks:[2,5,10]},
        {id:"ds3t2",title:"Dijkstra's & Bellman-Ford",marks:[5,10,13]},
        {id:"ds3t3",title:"Prim's & Kruskal's MST",marks:[5,10,13]},
      ]},
      {id:"ds4",unit:4,title:"Algorithm Design",topics:[
        {id:"ds4t1",title:"Divide & Conquer, Merge/Quick Sort",marks:[5,10,13]},
        {id:"ds4t2",title:"Greedy & Dynamic Programming",marks:[5,10,13]},
        {id:"ds4t3",title:"Backtracking",marks:[5,10]},
      ]},
      {id:"ds5",unit:5,title:"Algorithm Analysis",topics:[
        {id:"ds5t1",title:"Asymptotic Notations",marks:[2,5,10]},
        {id:"ds5t2",title:"Recurrence Relations",marks:[5,10,13]},
      ]},
    ]},
  { id:"oose",  code:"OOSE",   title:"OO Software Engineering",        color:"#7c3aed", icon:"🔷",
    units:[
      {id:"oo1",unit:1,title:"SDLC Models",topics:[
        {id:"oo1t1",title:"Waterfall & Prototyping Model",marks:[5,10,13]},
        {id:"oo1t2",title:"Spiral & XP Models",marks:[5,10,13]},
      ]},
      {id:"oo2",unit:2,title:"OO Requirements",topics:[
        {id:"oo2t1",title:"Use Case & SRS",marks:[5,10,13]},
        {id:"oo2t2",title:"OO Analysis & Classes",marks:[5,10,13]},
      ]},
      {id:"oo3",unit:3,title:"OO Design",topics:[
        {id:"oo3t1",title:"Sequence & Class Diagrams",marks:[5,10,13]},
        {id:"oo3t2",title:"OOD Methods & Case Studies",marks:[5,10,13]},
      ]},
      {id:"oo4",unit:4,title:"Testing & Maintenance",topics:[
        {id:"oo4t1",title:"Testing Types & Tools",marks:[5,10,13]},
        {id:"oo4t2",title:"Software Maintenance",marks:[5,10]},
      ]},
      {id:"oo5",unit:5,title:"Quality & Metrics",topics:[
        {id:"oo5t1",title:"OO Metrics & Estimation",marks:[5,10,13]},
      ]},
    ]},
  { id:"maths", code:"MATHS",  title:"Mathematics for Computing",      color:"#f59e0b", icon:"📐",
    units:[
      {id:"ma1",unit:1,title:"Matrices & Eigenvalues",topics:[
        {id:"ma1t1",title:"Rank & System of Equations",marks:[5,10,13]},
        {id:"ma1t2",title:"Eigenvalues & Cayley-Hamilton",marks:[5,10,13]},
      ]},
      {id:"ma2",unit:2,title:"Probability",topics:[
        {id:"ma2t1",title:"Probability Laws & Bayes Theorem",marks:[5,10,13]},
        {id:"ma2t2",title:"Distributions (Binomial, Normal)",marks:[5,10,13]},
      ]},
      {id:"ma3",unit:3,title:"2D Random Variables",topics:[
        {id:"ma3t1",title:"Joint Distributions & Correlation",marks:[5,10,13]},
        {id:"ma3t2",title:"Regression & Central Limit Theorem",marks:[5,10,13]},
      ]},
      {id:"ma4",unit:4,title:"Hypothesis Testing",topics:[
        {id:"ma4t1",title:"t-test, z-test, Chi-Square",marks:[5,10,13]},
      ]},
      {id:"ma5",unit:5,title:"Design of Experiments",topics:[
        {id:"ma5t1",title:"ANOVA & CRD, Latin Square",marks:[5,10,13]},
      ]},
    ]},
  { id:"dbms",  code:"DBMS",   title:"Database Management Systems",    color:"#06b6d4", icon:"🗃️",
    units:[
      {id:"db1",unit:1,title:"Relational Model",topics:[
        {id:"db1t1",title:"ER Model & Relational Algebra",marks:[5,10,13]},
        {id:"db1t2",title:"Normalization 1NF–5NF",marks:[5,10,13]},
      ]},
      {id:"db2",unit:2,title:"Parallel & Distributed DB",topics:[
        {id:"db2t1",title:"ACID & Concurrency Control",marks:[5,10,13]},
      ]},
      {id:"db3",unit:3,title:"XML & Web Databases",topics:[
        {id:"db3t1",title:"XML, DTD, JDBC, PHP",marks:[5,10,13]},
      ]},
      {id:"db4",unit:4,title:"NoSQL Databases",topics:[
        {id:"db4t1",title:"MongoDB CRUD & CAP Theorem",marks:[5,10,13]},
      ]},
      {id:"db5",unit:5,title:"Data Warehousing & Mining",topics:[
        {id:"db5t1",title:"OLAP, Star Schema, Apriori",marks:[5,10,13]},
        {id:"db5t2",title:"Decision Tree & k-Means",marks:[5,10,13]},
      ]},
    ]},
  { id:"rm",    code:"RM",     title:"Research Methodology & IPR",     color:"#ec4899", icon:"🔬",
    units:[
      {id:"rm1",unit:1,title:"Research Methodology",topics:[
        {id:"rm1t1",title:"Types, Approaches & Research Process",marks:[5,10,13]},
      ]},
      {id:"rm2",unit:2,title:"Research Design",topics:[
        {id:"rm2t1",title:"Experimental Design & Sampling",marks:[5,10,13]},
      ]},
      {id:"rm3",unit:3,title:"Tools & Report Writing",topics:[
        {id:"rm3t1",title:"Zotero, LaTeX, Plagiarism Tools",marks:[2,5]},
        {id:"rm3t2",title:"Hypothesis Testing & Report Writing",marks:[5,10,13]},
      ]},
      {id:"rm4",unit:4,title:"IPR",topics:[
        {id:"rm4t1",title:"IPR, Trademarks, WIPO, WTO",marks:[5,10,13]},
      ]},
      {id:"rm5",unit:5,title:"Patents",topics:[
        {id:"rm5t1",title:"Patent Filing, Licensing & Agents",marks:[5,10,13]},
      ]},
    ]},
  { id:"eng",   code:"ENG",    title:"Technical Communication",        color:"#f97316", icon:"💬",
    units:[
      {id:"en1",unit:1,title:"One-to-One Communication",topics:[
        {id:"en1t1",title:"Telephone & Formal Writing",marks:[5,10]},
      ]},
      {id:"en2",unit:2,title:"One-to-Many Communication",topics:[
        {id:"en2t1",title:"Memos, Circulars & Notices",marks:[5,10,13]},
      ]},
      {id:"en3",unit:3,title:"Narration",topics:[
        {id:"en3t1",title:"Formal Letter & Complaint Writing",marks:[5,10,13]},
      ]},
      {id:"en4",unit:4,title:"Description",topics:[
        {id:"en4t1",title:"Product Description & Essay Writing",marks:[5,10,13]},
      ]},
      {id:"en5",unit:5,title:"Comparison & Contrast",topics:[
        {id:"en5t1",title:"Analytical Essays & Presentations",marks:[5,10,13]},
      ]},
    ]},
  { id:"py",    code:"PYTHON", title:"Python Programming",             color:"#84cc16", icon:"🐍",
    units:[
      {id:"py1",unit:1,title:"Python Basics",topics:[
        {id:"py1t1",title:"Variables, Operators & Conditionals",marks:[2,5,10]},
        {id:"py1t2",title:"Loops, Functions & Recursion",marks:[5,10,13]},
      ]},
      {id:"py2",unit:2,title:"Data Types",topics:[
        {id:"py2t1",title:"Lists, Tuples, Sets, Dicts",marks:[5,10,13]},
        {id:"py2t2",title:"Strings & Modules",marks:[5,10]},
      ]},
      {id:"py3",unit:3,title:"File & Exception Handling",topics:[
        {id:"py3t1",title:"File Operations & Exceptions",marks:[5,10,13]},
      ]},
      {id:"py4",unit:4,title:"NumPy, Pandas, Matplotlib",topics:[
        {id:"py4t1",title:"NumPy & Pandas Basics",marks:[5,10,13]},
        {id:"py4t2",title:"Matplotlib & Plotly",marks:[5,10]},
      ]},
      {id:"py5",unit:5,title:"OOP in Python",topics:[
        {id:"py5t1",title:"Classes, Inheritance & Polymorphism",marks:[5,10,13]},
        {id:"py5t2",title:"Towers of Hanoi & Lab Programs",marks:[5,10,13]},
      ]},
    ]},
];

// ── QUESTION BANK ────────────────────────────────────────
const QB = {
  "ds1t2":[
    {id:"q1",marks:2,question:"Define Stack. What is LIFO? Give one real example.",kp:["Last In First Out","push/pop/peek","Example: plates stack or browser back button"]},
    {id:"q2",marks:5,question:"Explain Stack operations (push, pop, peek) with algorithm and example.",kp:["Stack definition","push with overflow","pop with underflow","peek","diagram"]},
    {id:"q3",marks:10,question:"Explain Stack with array implementation in C. List all applications.",kp:["C code","overflow/underflow","display","function calls","expression evaluation","undo/redo","browser history"]},
    {id:"q4",marks:13,question:"Implement Stack in C. Explain postfix evaluation for '5 3 + 2 *'. List all applications.",kp:["Full C code","postfix algorithm","step trace 5 3 + 2 * = 16","all applications","advantages"]},
  ],
  "oo1t1":[
    {id:"q5",marks:5,question:"Explain Waterfall Model with all phases and a neat diagram.",kp:["All 6 phases","sequential flow","output of each phase","advantages","disadvantages"]},
    {id:"q6",marks:10,question:"Compare Waterfall, Prototyping, and Spiral models. When is each used?",kp:["Waterfall phases","Prototyping cycle","Spiral 4 quadrants","comparison table","selection criteria"]},
  ],
  "ma2t1":[
    {id:"q7",marks:5,question:"State Bayes' Theorem. Apply it to a medical test example.",kp:["Formula P(A|B)","prior probability","posterior probability","step-by-step example","real scenario"]},
  ],
  "py1t2":[
    {id:"q8",marks:5,question:"Explain for loop and while loop in Python with examples.",kp:["for loop syntax","while loop syntax","break & continue","range()","example programs"]},
    {id:"q9",marks:10,question:"Write Python programs using loops, break, continue. Also explain recursive functions.",kp:["for loop","while loop","break","continue","recursive factorial","recursion vs iteration"]},
  ],
  "db1t2":[
    {id:"q10",marks:10,question:"Explain 1NF, 2NF, 3NF normalization with examples and the problems they solve.",kp:["Redundancy problem","1NF atomic values","2NF no partial dependency","3NF no transitive dependency","before & after tables"]},
  ],
};

// ── LAB EXERCISES ────────────────────────────────────────
const LABS=[
  {id:"l1",sub:"ds",title:"Stack using Array (C)",type:"C",desc:"Build push, pop, peek — like a pile of books!",
   starter:`#include <stdio.h>
#define MAX 10
int stack[MAX], top = -1;

void push(int val) {
    // TODO: if stack not full, add val
}
int pop() {
    // TODO: if stack not empty, remove top
    return -1;
}
void display() {
    // TODO: print all elements top to bottom
}
int main() {
    push(10); push(20); push(30);
    display();
    printf("Popped: %d\\n", pop());
    display();
    return 0;
}`,
   solution:`#include <stdio.h>
#define MAX 10
int stack[MAX], top = -1;

void push(int val) {
    if(top == MAX-1) { printf("Stack Full!\\n"); return; }
    stack[++top] = val;
}
int pop() {
    if(top == -1) { printf("Stack Empty!\\n"); return -1; }
    return stack[top--];
}
void display() {
    printf("Stack: ");
    for(int i = top; i >= 0; i--) printf("%d ", stack[i]);
    printf("\\n");
}
int main() {
    push(10); push(20); push(30);
    display();
    printf("Popped: %d\\n", pop());
    display();
    return 0;
}`,tests:["Push 10,20,30 → prints 30 20 10","Pop → returns 30","Display after pop → 20 10"]},
  {id:"l2",sub:"py",title:"Binary Search in Python",type:"Python",desc:"Find a number in sorted list quickly!",
   starter:`def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        # TODO: check arr[mid] == target
        # TODO: if target bigger, search right
        # TODO: if target smaller, search left
    return -1

nums = [2,5,8,12,16,23,38,56,72,91]
print(binary_search(nums, 23))   # should print 5
print(binary_search(nums, 100))  # should print -1`,
   solution:`def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target: return mid
        elif target > arr[mid]: low = mid + 1
        else: high = mid - 1
    return -1

nums = [2,5,8,12,16,23,38,56,72,91]
print(binary_search(nums, 23))
print(binary_search(nums, 100))`,tests:["Search 23 → index 5","Search 100 → -1","Works on any sorted list"]},
  {id:"l3",sub:"dbms",title:"SQL: Student Table CRUD",type:"SQL",desc:"Create, read, update, delete student records!",
   starter:`-- Create table with id, name, age, marks
CREATE TABLE Student (
    -- TODO: add columns
);
-- Insert 3 students
-- TODO: INSERT rows
-- Show students with marks > 70
-- TODO: SELECT query
-- Update age of student id=1
-- TODO: UPDATE query`,
   solution:`CREATE TABLE Student (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    marks FLOAT
);
INSERT INTO Student VALUES (1,'Priya',22,85.5);
INSERT INTO Student VALUES (2,'Rahul',23,67.0);
INSERT INTO Student VALUES (3,'Ananya',21,91.0);
SELECT * FROM Student WHERE marks > 70;
UPDATE Student SET age = 23 WHERE id = 1;`,tests:["Table with 4 columns","3 rows inserted","SELECT returns Priya & Ananya","UPDATE changes age"]},
];

// ── LOCAL STORAGE AUTH ───────────────────────────────────
const getUsers   = () => { try{ return JSON.parse(localStorage.getItem("sf_users")||"[]"); }catch{return[];} };
const saveUsers  = u  => localStorage.setItem("sf_users", JSON.stringify(u));
const getSession = () => { try{ return JSON.parse(localStorage.getItem("sf_session")||"null"); }catch{return null;} };
const saveSession= s  => localStorage.setItem("sf_session", s?JSON.stringify(s):"null");
const getUserData= id => { try{ return JSON.parse(localStorage.getItem(`sf_d_${id}`)||"{}"); }catch{return {};} };
const saveUserData=(id,d)=> localStorage.setItem(`sf_d_${id}`, JSON.stringify(d));
const getApiKey  = () => localStorage.getItem("sf_api")||CONFIG.ANTHROPIC_KEY||"";
const saveApiKey = k  => localStorage.setItem("sf_api", k);

// ── AI CALL ──────────────────────────────────────────────
async function callAI(messages, system) {
  const key = getApiKey();
  if (!key) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages })
  });
  if (!res.ok) { const e=await res.json().catch(()=>({})); throw new Error(e?.error?.message||`API error ${res.status}`); }
  const d = await res.json();
  return d.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
}

// ── HELPERS ──────────────────────────────────────────────
function useData(user) {
  const uid = user?.id;
  const [data, _set] = useState(()=>uid?getUserData(uid):{});
  const setData = useCallback(d=>{ _set(d); if(uid) saveUserData(uid,d); },[uid]);
  useEffect(()=>{ if(uid) _set(getUserData(uid)); },[uid]);
  return [data, setData];
}
const todayKey   = () => new Date().toDateString();
const canUseAI   = (data,plan) => plan==="pro"||plan==="admin" ? true : (data.aiUsage?.[todayKey()]||0) < CONFIG.FREE_AI_LIMIT;
const aiUsedToday= (data) => data.aiUsage?.[todayKey()]||0;
function recordAIUse(data, setData) {
  const t=todayKey(), used=data.aiUsage?.[t]||0;
  setData({...data,aiUsage:{...(data.aiUsage||{}),[t]:used+1}});
}

// ── SMALL UI BITS ─────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.fade{animation:fadeUp .28s ease forwards}
.pulse{animation:pulse 1.6s infinite}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#07070e}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ffffff18;border-radius:9px}
textarea,input,select,button{font-family:inherit}
`;

function Spin({size=16}){
  return <div style={{width:size,height:size,border:"2px solid #ffffff18",borderTop:"2px solid #00c9a7",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite",flexShrink:0}}/>;
}
function Badge({c="#00c9a7",children,sm}){
  return <span style={{background:c+"22",color:c,border:`1px solid ${c}44`,borderRadius:6,padding:sm?"1px 7px":"3px 10px",fontSize:sm?9:11,fontWeight:700,letterSpacing:.3,whiteSpace:"nowrap"}}>{children}</span>;
}
function Bar({v=0,max=1,c="#00c9a7",h=5}){
  const pct=Math.min(100,max>0?Math.round((v/max)*100):0);
  return <div style={{background:"#ffffff0a",borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:99,transition:"width .5s"}}/></div>;
}
function Btn({children,onClick,c="#00c9a7",disabled,full,sm,danger}){
  const col=danger?"#ef4444":c;
  return <button disabled={disabled} onClick={onClick} style={{
    width:full?"100%":"auto",padding:sm?"6px 14px":"10px 22px",
    background:disabled?"#ffffff05":col+"1e",border:`1px solid ${disabled?"#ffffff10":col+"44"}`,
    borderRadius:9,color:disabled?"#ffffff22":col,cursor:disabled?"not-allowed":"pointer",
    fontSize:sm?11:13,fontWeight:600,letterSpacing:.4,
    display:"inline-flex",alignItems:"center",gap:8,justifyContent:"center",transition:"all .18s",whiteSpace:"nowrap"
  }}>{children}</button>;
}
function Card({children,onClick,style:s={},glow}){
  return <div onClick={onClick} style={{background:"#ffffff06",border:`1px solid ${glow?glow+"44":"#ffffff0d"}`,borderRadius:14,padding:20,...s,cursor:onClick?"pointer":"default",transition:"all .18s"}}
    onMouseEnter={e=>{if(onClick){e.currentTarget.style.borderColor=glow?glow+"88":"#ffffff22";e.currentTarget.style.transform="translateY(-2px)";}}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=glow?glow+"44":"#ffffff0d";e.currentTarget.style.transform="";}}>
    {children}
  </div>;
}
function Input({label,type="text",value,onChange,placeholder,hint}){
  return <div style={{marginBottom:16}}>
    {label&&<div style={{fontSize:10,color:"#ffffff55",letterSpacing:2,marginBottom:7,fontWeight:600}}>{label}</div>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:"#ffffff08",border:"1px solid #ffffff18",borderRadius:9,padding:"11px 14px",color:"#dde1f0",fontSize:13,outline:"none"}}/>
    {hint&&<div style={{fontSize:11,color:"#ffffff33",marginTop:5}}>{hint}</div>}
  </div>;
}

function AIText({text}){
  if(!text) return null;
  return <div style={{fontSize:13,lineHeight:2,color:"#dde1f0"}}>
    {text.split("\n").map((line,i)=>{
      if(!line.trim()) return <div key={i} style={{height:8}}/>;
      const hl=line
        .replace(/\*\*([^*]+)\*\*/g,'<strong style="color:#fff">$1</strong>')
        .replace(/`([^`]+)`/g,'<code style="background:#ffffff12;padding:1px 7px;borderRadius:4px;fontFamily:monospace;fontSize:11px;color:#84cc16">$1</code>');
      if(/^##+ /.test(line)) return <div key={i} style={{fontWeight:600,fontSize:14,color:"#fff",margin:"16px 0 7px",paddingBottom:6,borderBottom:"1px solid #ffffff10"}} dangerouslySetInnerHTML={{__html:hl.replace(/^#+\s*/,"")}}/>;
      if(/^[\*\-•] /.test(line)) return <div key={i} style={{display:"flex",gap:9,margin:"3px 0",paddingLeft:4}}><span style={{color:"#00c9a7",flexShrink:0,marginTop:3}}>▸</span><span dangerouslySetInnerHTML={{__html:hl.replace(/^[\*\-•] /,"")}}/></div>;
      if(/^\d+\. /.test(line)){const n=line.match(/^(\d+)/)?.[1];return <div key={i} style={{display:"flex",gap:10,margin:"4px 0"}}><span style={{background:"#00c9a720",color:"#00c9a7",border:"1px solid #00c9a730",borderRadius:5,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{n}</span><span dangerouslySetInnerHTML={{__html:hl.replace(/^\d+\. /,"")}} style={{lineHeight:1.75}}/></div>;}
      if(/^```/.test(line)||/^    /.test(line)) return <div key={i} style={{fontFamily:"monospace",fontSize:12,color:"#84cc16",background:"#0a0f1e",padding:"2px 10px",borderLeft:"2px solid #84cc1640"}} dangerouslySetInnerHTML={{__html:line.replace(/^```\w*/,"").replace(/^    /,"")}}/>;
      return <p key={i} style={{margin:"2px 0",lineHeight:1.9}} dangerouslySetInnerHTML={{__html:hl}}/>;
    })}
  </div>;
}

// ═══════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════
export default function App(){
  const [user, setUser] = useState(()=>getSession());
  const [apiKey, setApiKey] = useState(getApiKey);
  const [data, setData] = useData(user);
  const [showSettings, setShowSettings] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(()=>{ if(apiKey) saveApiKey(apiKey); },[apiKey]);

  const login  = u => { saveSession(u); setUser(u); };
  const logout = () => { saveSession(null); setUser(null); setAdminMode(false); };
  const plan   = user?.plan||"free";

  if(!user) return <AuthScreen onLogin={login}/>;
  if(plan==="admin"&&adminMode) return <AdminDashboard user={user} onBack={()=>setAdminMode(false)} onLogout={logout}/>;

  return (
    <MainApp user={user} data={data} setData={setData} plan={plan}
      apiKey={apiKey} setApiKey={setApiKey}
      onLogout={logout}
      showSettings={showSettings} setShowSettings={setShowSettings}
      showPaywall={showPaywall} setShowPaywall={setShowPaywall}
      onAdmin={plan==="admin"?()=>setAdminMode(true):null}/>
  );
}

// ═══════════════════════════════════════════════════════
//  AUTH SCREEN  — Fixed: labels visible, no blank buttons
// ═══════════════════════════════════════════════════════
function AuthScreen({onLogin}){
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setErr(""); setLoading(true);
    setTimeout(()=>{
      const users = getUsers();
      if(mode==="register"){
        if(!name||!email||!pass){ setErr("Please fill all fields."); setLoading(false); return; }
        if(users.find(u=>u.email===email)){ setErr("This email is already registered. Try Sign In."); setLoading(false); return; }
        const isOwner = email===CONFIG.OWNER_EMAIL;
        const nu = {id:`u_${Date.now()}`,name,email,pass,plan:isOwner?"admin":"free",joined:Date.now()};
        saveUsers([...users,nu]);
        onLogin(nu);
      } else {
        // Owner can also sign in with owner password even if not registered
        if(email===CONFIG.OWNER_EMAIL && pass===CONFIG.OWNER_PASSWORD){
          const existing = users.find(u=>u.email===email);
          if(existing){ onLogin({...existing,plan:"admin"}); setLoading(false); return; }
          const nu={id:`owner_${Date.now()}`,name:"Admin Owner",email,pass,plan:"admin",joined:Date.now()};
          saveUsers([...users,nu]); onLogin(nu); setLoading(false); return;
        }
        const u=users.find(u=>u.email===email&&u.pass===pass);
        if(!u){ setErr("Wrong email or password. Try again."); setLoading(false); return; }
        onLogin(u);
      }
      setLoading(false);
    },400);
  };

  return (
    <div style={{fontFamily:"'IBM Plex Mono',monospace",background:"#07070e",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{css}</style>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#00c9a7,#7c3aed)",fontSize:24,marginBottom:12}}>🎓</div>
          <div style={{fontSize:22,fontWeight:600,color:"#fff",letterSpacing:2}}>STUDYFORGE</div>
          <div style={{fontSize:10,color:"#ffffff33",letterSpacing:3,marginTop:4}}>MCA · ANNA UNIVERSITY · SEM 1</div>
        </div>

        <Card style={{padding:26}}>
          {/* Tabs */}
          <div style={{display:"flex",background:"#ffffff08",borderRadius:9,padding:3,marginBottom:22}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");}}
                style={{flex:1,padding:"9px",background:mode===m?"#ffffff14":"transparent",border:"none",borderRadius:7,
                  color:mode===m?"#fff":"#ffffff55",cursor:"pointer",fontSize:12,fontWeight:mode===m?600:400,transition:"all .2s"}}>
                {m==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          {mode==="register"&&<Input label="YOUR NAME" value={name} onChange={setName} placeholder="e.g. Priya Rajan"/>}
          <Input label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail} placeholder="your@email.com"/>
          <Input label="PASSWORD" type="password" value={pass} onChange={setPass} placeholder="••••••••"
            hint={mode==="register"?"Remember this password — you need it to log in later":undefined}/>

          {err&&<div style={{background:"#ef444412",border:"1px solid #ef444430",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#f87171",marginBottom:14,lineHeight:1.6}}>{err}</div>}

          <Btn full onClick={handle} disabled={loading} c="#00c9a7">
            {loading?<><Spin/> Please wait...</>:mode==="login"?"Sign In →":"Create Free Account →"}
          </Btn>

          {/* FIXED: Demo buttons with visible labels */}
          <div style={{margin:"18px 0 0",borderTop:"1px solid #ffffff0d",paddingTop:16}}>
            <div style={{fontSize:10,color:"#ffffff33",letterSpacing:2,marginBottom:10,textAlign:"center"}}>QUICK DEMO</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <button onClick={()=>{
                  const u={id:"demo_free",name:"Demo Student",email:"demo@free.com",plan:"free",joined:Date.now()};
                  const users=getUsers(); if(!users.find(x=>x.id===u.id)) saveUsers([...users,u]);
                  onLogin(u);
                }}
                style={{padding:"10px 14px",background:"#ffffff0a",border:"1px solid #ffffff22",borderRadius:9,
                  color:"#ffffff88",cursor:"pointer",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                👤 Free User
              </button>
              <button onClick={()=>{
                  const u={id:"demo_admin",name:"Admin Owner",email:"demo@admin.com",plan:"admin",joined:Date.now()};
                  const users=getUsers(); if(!users.find(x=>x.id===u.id)) saveUsers([...users,u]);
                  onLogin(u);
                }}
                style={{padding:"10px 14px",background:"#f59e0b0f",border:"1px solid #f59e0b44",borderRadius:9,
                  color:"#f59e0b",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                ⚡ Admin View
              </button>
            </div>
          </div>
        </Card>

        {/* Admin hint */}
        <div style={{marginTop:14,background:"#7c3aed0a",border:"1px solid #7c3aed22",borderRadius:10,padding:14,fontSize:11,color:"#a78bfa",lineHeight:1.85}}>
          <strong style={{color:"#c4b5fd"}}>Admin login:</strong> Register with <code style={{background:"#ffffff10",padding:"1px 5px",borderRadius:4}}>{CONFIG.OWNER_EMAIL}</code> and password <code style={{background:"#ffffff10",padding:"1px 5px",borderRadius:4}}>{CONFIG.OWNER_PASSWORD}</code> to get full admin access.
        </div>

        <div style={{marginTop:10,background:"#00c9a70a",border:"1px solid #00c9a720",borderRadius:10,padding:14,fontSize:11,color:"#ffffff55",lineHeight:1.8}}>
          🆓 Free: 5 AI calls/day · All 7 subjects<br/>
          ⚡ Pro ({CONFIG.PRO_PRICE_DISPLAY}/mo): Unlimited AI + tests
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN APP SHELL  — Fixed: visible header buttons
// ═══════════════════════════════════════════════════════
function MainApp({user,data,setData,plan,apiKey,setApiKey,onLogout,showSettings,setShowSettings,showPaywall,setShowPaywall,onAdmin}){
  const [tab, setTab] = useState("dashboard");
  const planColor = plan==="admin"?"#f59e0b":plan==="pro"?"#00c9a7":"#ffffff55";
  const aiLeft = plan==="free"?Math.max(0,CONFIG.FREE_AI_LIMIT-aiUsedToday(data)):null;

  const tryAI = fn => {
    if(!canUseAI(data,plan)){ setShowPaywall(true); return; }
    if(!getApiKey()){ setShowSettings(true); return; }
    fn();
  };

  const NAV=[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"learn",icon:"📖",label:"Learn"},
    {id:"practice",icon:"✏️",label:"Practice"},
    {id:"lab",icon:"⌨️",label:"Lab"},
    {id:"test",icon:"⏱️",label:"Mock Test"},
  ];

  return (
    <div style={{fontFamily:"'IBM Plex Mono',monospace",background:"#07070e",minHeight:"100vh",color:"#dde1f0",display:"flex",flexDirection:"column"}}>
      <style>{css}</style>

      {/* HEADER — Fixed: all buttons have visible text */}
      <header style={{borderBottom:"1px solid #ffffff0d",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#09090f",position:"sticky",top:0,zIndex:99,gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{background:"linear-gradient(135deg,#00c9a7,#7c3aed)",width:32,height:32,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🎓</div>
          <div>
            <div style={{fontWeight:600,fontSize:13,letterSpacing:2,color:"#fff"}}>STUDYFORGE</div>
            <div style={{fontSize:9,color:"#ffffff33",letterSpacing:2}}>MCA · SEM 1</div>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          {plan==="free"&&aiLeft!==null&&(
            <div style={{fontSize:11,color:aiLeft>1?"#f59e0b":"#ef4444",whiteSpace:"nowrap"}}>
              ⚡ {aiLeft} AI left today
            </div>
          )}
          <Badge c={planColor}>{plan.toUpperCase()}</Badge>
          {onAdmin&&(
            <button onClick={onAdmin} style={{
              padding:"6px 12px",background:"#f59e0b0f",border:"1px solid #f59e0b44",
              borderRadius:8,color:"#f59e0b",cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"
            }}>Admin</button>
          )}
          <button onClick={()=>setShowSettings(true)} style={{
            padding:"6px 14px",background:"#ffffff08",border:"1px solid #ffffff22",
            borderRadius:8,color:"#ffffff88",cursor:"pointer",fontSize:11,fontWeight:500,whiteSpace:"nowrap"
          }}>⚙ Settings</button>
          <button onClick={onLogout} style={{
            padding:"6px 14px",background:"#ef44440a",border:"1px solid #ef444430",
            borderRadius:8,color:"#f87171",cursor:"pointer",fontSize:11,fontWeight:500,whiteSpace:"nowrap"
          }}>Logout</button>
        </div>
      </header>

      {/* NAV */}
      <nav style={{borderBottom:"1px solid #ffffff08",padding:"0 16px",display:"flex",gap:2,background:"#0a0a12",overflowX:"auto"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{
            background:"transparent",border:"none",color:tab===n.id?"#00c9a7":"#ffffff55",cursor:"pointer",
            padding:"10px 14px",fontSize:11,letterSpacing:.6,fontWeight:tab===n.id?600:400,
            borderBottom:tab===n.id?"2px solid #00c9a7":"2px solid transparent",
            whiteSpace:"nowrap",transition:"all .18s"
          }}>{n.icon} {n.label}</button>
        ))}
      </nav>

      <main style={{flex:1,padding:"20px 18px",maxWidth:1060,margin:"0 auto",width:"100%"}}>
        {tab==="dashboard"&&<DashTab user={user} data={data} plan={plan} aiLeft={aiLeft} onUpgrade={()=>setShowPaywall(true)} onAdmin={onAdmin}/>}
        {tab==="learn"    &&<LearnTab data={data} setData={setData} plan={plan} tryAI={tryAI} recordAI={()=>recordAIUse(data,setData)}/>}
        {tab==="practice" &&<PracticeTab data={data} setData={setData} plan={plan} tryAI={tryAI} recordAI={()=>recordAIUse(data,setData)}/>}
        {tab==="lab"      &&<LabTab plan={plan} tryAI={tryAI} recordAI={()=>recordAIUse(data,setData)}/>}
        {tab==="test"     &&<TestTab data={data} setData={setData} plan={plan} tryAI={tryAI} recordAI={()=>recordAIUse(data,setData)}/>}
      </main>

      {showSettings&&<SettingsModal user={user} apiKey={apiKey} setApiKey={setApiKey} plan={plan} onClose={()=>setShowSettings(false)} onUpgrade={()=>{setShowSettings(false);setShowPaywall(true);}}/>}
      {showPaywall &&<PaywallModal user={user} plan={plan} onClose={()=>setShowPaywall(false)}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════
function SettingsModal({user,apiKey,setApiKey,plan,onClose,onUpgrade}){
  const [key,setKey]=useState(apiKey);
  const save=()=>{ setApiKey(key); saveApiKey(key); onClose(); };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <Card style={{width:"100%",maxWidth:480,padding:26}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:600,fontSize:15,color:"#fff"}}>⚙ Settings</div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#ffffff55",cursor:"pointer",fontSize:20,lineHeight:1}}>✕</button>
        </div>

        <div style={{background:"#ffffff08",borderRadius:10,padding:14,marginBottom:18}}>
          <div style={{fontSize:10,color:"#ffffff44",marginBottom:4,letterSpacing:2}}>LOGGED IN AS</div>
          <div style={{color:"#fff",fontWeight:500}}>{user.name}</div>
          <div style={{color:"#ffffff44",fontSize:12,marginTop:2}}>{user.email}</div>
          <div style={{marginTop:8}}><Badge c={plan==="admin"?"#f59e0b":plan==="pro"?"#00c9a7":"#ffffff55"}>{plan.toUpperCase()}</Badge></div>
        </div>

        <div style={{fontSize:10,color:"#ffffff44",letterSpacing:2,marginBottom:8}}>ANTHROPIC API KEY</div>
        <div style={{fontSize:11,color:"#ffffff33",marginBottom:10,lineHeight:1.75}}>
          Get free key at <span style={{color:"#00c9a7"}}>console.anthropic.com</span> → API Keys → Create Key.<br/>
          Free $5 credit = ~200 AI calls. Key stays on your device only.
        </div>
        <input type="password" value={key} onChange={e=>setKey(e.target.value)}
          placeholder="sk-ant-api03-..."
          style={{width:"100%",background:"#ffffff08",border:"1px solid #ffffff22",borderRadius:9,padding:"11px 14px",color:"#dde1f0",fontSize:13,outline:"none",marginBottom:14}}/>

        <div style={{display:"flex",gap:10}}>
          <Btn full onClick={save} c="#00c9a7">Save Key</Btn>
          {plan==="free"&&<Btn full onClick={onUpgrade} c="#7c3aed">Upgrade to Pro</Btn>}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PAYWALL — Fixed: no Razorpay crash, shows clear message
// ═══════════════════════════════════════════════════════
function PaywallModal({user,plan,onClose}){
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [err,setErr]=useState("");

  const pay=()=>{
    if(!CONFIG.RAZORPAY_KEY||CONFIG.RAZORPAY_KEY==="rzp_test_XXXX"){
      setErr("Payment not set up yet! The app owner has not added a Razorpay key. Please contact them to enable payments.");
      return;
    }
    setLoading(true);
    const script=document.createElement("script");
    script.src="https://checkout.razorpay.com/v1/checkout.js";
    script.onload=()=>{
      new window.Razorpay({
        key:CONFIG.RAZORPAY_KEY,
        amount:CONFIG.PRO_PRICE,
        currency:"INR",
        name:"StudyForge Pro",
        description:"Unlimited AI study for MCA Sem 1",
        prefill:{name:user.name,email:user.email},
        theme:{color:"#00c9a7"},
        handler:(response)=>{
          const users=getUsers();
          const updated=users.map(u=>u.id===user.id?{...u,plan:"pro",paidAt:Date.now()}:u);
          saveUsers(updated);
          saveSession({...user,plan:"pro"});
          setDone(true); setLoading(false);
          setTimeout(()=>window.location.reload(),1500);
        },
        modal:{ondismiss:()=>setLoading(false)}
      }).open();
    };
    script.onerror=()=>{ setLoading(false); setErr("Could not load payment. Check your internet connection."); };
    document.body.appendChild(script);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000000dd",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
      <Card style={{width:"100%",maxWidth:460,padding:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:600,fontSize:16,color:"#fff"}}>⚡ Upgrade to Pro</div>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#ffffff44",cursor:"pointer",fontSize:20,lineHeight:1}}>✕</button>
        </div>

        {done?(
          <div style={{textAlign:"center",padding:30}}>
            <div style={{fontSize:40,marginBottom:12}}>🎉</div>
            <div style={{color:"#00c9a7",fontWeight:600,fontSize:16}}>Payment Successful!</div>
            <div style={{color:"#ffffff44",fontSize:12,marginTop:8}}>Refreshing your account...</div>
          </div>
        ):(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
              <Card style={{padding:16,borderColor:"#ffffff18"}}>
                <div style={{fontSize:12,color:"#ffffff44",marginBottom:8}}>🆓 FREE</div>
                <div style={{fontSize:22,fontWeight:600,color:"#fff"}}>₹0</div>
                <div style={{fontSize:11,color:"#ffffff44",marginTop:10,lineHeight:1.85}}>
                  5 AI calls/day<br/>2 mock tests/day<br/>All 7 subjects
                </div>
              </Card>
              <Card style={{padding:16,borderColor:"#00c9a777",background:"#00c9a708"}}>
                <div style={{fontSize:12,color:"#00c9a7",marginBottom:8}}>⚡ PRO</div>
                <div style={{fontSize:22,fontWeight:600,color:"#fff"}}>₹99<span style={{fontSize:12,color:"#ffffff44"}}>/mo</span></div>
                <div style={{fontSize:11,color:"#ffffff88",marginTop:10,lineHeight:1.85}}>
                  <strong style={{color:"#00c9a7"}}>Unlimited</strong> AI calls<br/>
                  <strong style={{color:"#00c9a7"}}>Unlimited</strong> tests<br/>
                  Hint system<br/>Progress synced
                </div>
              </Card>
            </div>

            {err&&(
              <div style={{background:"#f59e0b0e",border:"1px solid #f59e0b33",borderRadius:10,padding:14,fontSize:12,color:"#fcd34d",marginBottom:14,lineHeight:1.7}}>
                ⚠ {err}
              </div>
            )}

            <Btn full onClick={pay} disabled={loading} c="#00c9a7">
              {loading?<><Spin/> Opening payment...</>:"Pay ₹99 via UPI / Card / Net Banking"}
            </Btn>
            <div style={{marginTop:12,fontSize:11,color:"#ffffff33",textAlign:"center"}}>
              Powered by Razorpay · UPI · Cards · Net Banking · Wallets
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ADMIN DASHBOARD — Fixed: real data, proper layout
// ═══════════════════════════════════════════════════════
function AdminDashboard({user,onBack,onLogout}){
  const users = getUsers();
  const realUsers = users.filter(u=>!u.id.startsWith("demo_"));
  const proUsers  = realUsers.filter(u=>u.plan==="pro");
  const freeUsers = realUsers.filter(u=>u.plan==="free");
  const allUsers  = realUsers.filter(u=>u.plan!=="admin");
  const revenue   = proUsers.length*99;

  const totalAI = users.reduce((s,u)=>{
    const d=getUserData(u.id);
    return s+Object.values(d.aiUsage||{}).reduce((a,b)=>a+b,0);
  },0);

  return (
    <div style={{fontFamily:"'IBM Plex Mono',monospace",background:"#07070e",minHeight:"100vh",color:"#dde1f0"}}>
      <style>{css}</style>
      <header style={{borderBottom:"1px solid #ffffff0d",padding:"11px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#09090f",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} style={{padding:"6px 14px",background:"#ffffff08",border:"1px solid #ffffff22",borderRadius:8,color:"#ffffff88",cursor:"pointer",fontSize:11,fontWeight:500}}>← Back to App</button>
          <div style={{fontWeight:600,fontSize:14,color:"#f59e0b",letterSpacing:1}}>⚡ ADMIN DASHBOARD</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Badge c="#f59e0b">OWNER</Badge>
          <button onClick={onLogout} style={{padding:"6px 14px",background:"#ef44440a",border:"1px solid #ef444430",borderRadius:8,color:"#f87171",cursor:"pointer",fontSize:11,fontWeight:500}}>Logout</button>
        </div>
      </header>

      <main style={{padding:"22px 20px",maxWidth:1060,margin:"0 auto"}}>
        <div className="fade">
          <h2 style={{fontSize:18,fontWeight:600,color:"#fff",marginBottom:20}}>Business Overview</h2>

          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
            {[
              {l:"Monthly Revenue",v:`₹${revenue}`,c:"#00c9a7",s:`${proUsers.length} pro users`},
              {l:"Total Students",v:allUsers.length,c:"#7c3aed",s:`${proUsers.length} pro · ${freeUsers.length} free`},
              {l:"AI Calls Used",v:totalAI,c:"#f59e0b",s:"all users total"},
              {l:"API Cost Est.",v:`₹${Math.round(totalAI*0.07)}`,c:"#ec4899",s:"~₹0.07/call"},
            ].map(s=>(
              <Card key={s.l} style={{padding:16}}>
                <div style={{fontSize:10,color:"#ffffff33",letterSpacing:2,marginBottom:8}}>{s.l.toUpperCase()}</div>
                <div style={{fontSize:24,fontWeight:600,color:s.c}}>{s.v}</div>
                <div style={{fontSize:11,color:"#ffffff33",marginTop:5}}>{s.s}</div>
              </Card>
            ))}
          </div>

          {/* Profit box */}
          <Card style={{marginBottom:22,background:"#00c9a708",borderColor:"#00c9a730"}}>
            <div style={{fontWeight:600,color:"#00c9a7",marginBottom:12,fontSize:13}}>💰 PROFIT ESTIMATE (this month)</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:10}}>
              <div><div style={{fontSize:11,color:"#ffffff33",marginBottom:4}}>Revenue</div><div style={{fontSize:20,fontWeight:600,color:"#fff"}}>₹{revenue}</div></div>
              <div><div style={{fontSize:11,color:"#ffffff33",marginBottom:4}}>API Cost (~15%)</div><div style={{fontSize:20,fontWeight:600,color:"#ef4444"}}>-₹{Math.round(revenue*0.15)}</div></div>
              <div><div style={{fontSize:11,color:"#ffffff33",marginBottom:4}}>Net Profit</div><div style={{fontSize:20,fontWeight:600,color:"#00c9a7"}}>₹{Math.round(revenue*0.85)}</div></div>
            </div>
            <div style={{fontSize:11,color:"#ffffff33"}}>
              50 pro users → ₹{Math.round(50*99*0.85)}/month &nbsp;·&nbsp; 200 users → ₹{Math.round(200*99*0.85)}/month
            </div>
          </Card>

          {/* Users table */}
          <div style={{fontWeight:600,color:"#fff",marginBottom:12,fontSize:14}}>
            All Students ({allUsers.length})
            {allUsers.length===0&&<span style={{fontSize:11,color:"#ffffff33",fontWeight:400,marginLeft:10}}>— No real users yet. Share your app link to get students!</span>}
          </div>
          <Card style={{padding:0,overflow:"hidden",marginBottom:22}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #ffffff0d"}}>
                    {["Name","Email","Plan","Joined","AI Calls"].map(h=>(
                      <th key={h} style={{padding:"11px 16px",textAlign:"left",color:"#ffffff33",letterSpacing:1,fontSize:10,fontWeight:700}}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length===0?(
                    <tr><td colSpan={5} style={{padding:30,textAlign:"center",color:"#ffffff22",fontSize:12}}>
                      No students registered yet. Share your link: <span style={{color:"#00c9a7"}}>study-forge-mca.vercel.app</span>
                    </td></tr>
                  ):allUsers.map(u=>{
                    const d=getUserData(u.id);
                    const calls=Object.values(d.aiUsage||{}).reduce((a,b)=>a+b,0);
                    const pc=u.plan==="pro"?"#00c9a7":u.plan==="admin"?"#f59e0b":"#ffffff44";
                    return (
                      <tr key={u.id} style={{borderBottom:"1px solid #ffffff06",transition:"background .15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#ffffff05"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"11px 16px",color:"#fff",fontWeight:500}}>{u.name}</td>
                        <td style={{padding:"11px 16px",color:"#ffffff44"}}>{u.email}</td>
                        <td style={{padding:"11px 16px"}}><Badge c={pc} sm>{u.plan.toUpperCase()}</Badge></td>
                        <td style={{padding:"11px 16px",color:"#ffffff33"}}>{u.joined?new Date(u.joined).toLocaleDateString("en-IN"):"-"}</td>
                        <td style={{padding:"11px 16px",color:"#00c9a7",fontWeight:500}}>{calls}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Tips */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card style={{background:"#7c3aed08",borderColor:"#7c3aed25"}}>
              <div style={{fontWeight:600,color:"#a78bfa",marginBottom:10,fontSize:12}}>🚀 GROW YOUR USER BASE</div>
              <div style={{fontSize:11,color:"#ffffff44",lineHeight:1.95}}>
                • Share in MCA WhatsApp groups<br/>
                • Post in Anna University Facebook groups<br/>
                • Share with coaching centres (batch deals)<br/>
                • Offer 1 month free to first 20 students<br/>
                • Add VTU, Madras Univ to attract more users
              </div>
            </Card>
            <Card style={{background:"#f59e0b08",borderColor:"#f59e0b25"}}>
              <div style={{fontWeight:600,color:"#fbbf24",marginBottom:10,fontSize:12}}>⚙ NEXT STEPS TO EARN MORE</div>
              <div style={{fontSize:11,color:"#ffffff44",lineHeight:1.95}}>
                1. Add your real Razorpay key in CONFIG<br/>
                2. Add your Anthropic API key in CONFIG<br/>
                3. Change OWNER_EMAIL to your real email<br/>
                4. Deploy to Vercel with these changes<br/>
                5. Share the link and start collecting ₹99!
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  DASHBOARD TAB
// ═══════════════════════════════════════════════════════
function DashTab({user,data,plan,aiLeft,onUpgrade,onAdmin}){
  const progress=data.progress||{};
  const scores=data.scores||[];
  const streak=data.streak||{count:1};
  const total=SUBJECTS.reduce((s,sub)=>s+sub.units.reduce((u,un)=>u+un.topics.length,0),0);
  const done=Object.values(progress).filter(p=>p.completed).length;
  const avg=scores.length?Math.round(scores.reduce((s,r)=>s+(r.got/r.max)*100,0)/scores.length):0;

  return (
    <div className="fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontSize:19,fontWeight:600,color:"#fff"}}>Welcome back, {user.name.split(" ")[0]}! 👋</h2>
          <p style={{color:"#ffffff44",fontSize:12,marginTop:4}}>Anna University MCA · Semester 1 · {SUBJECTS.length} Subjects</p>
        </div>
        {plan==="free"&&<Btn onClick={onUpgrade} c="#00c9a7">⚡ Upgrade to Pro</Btn>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:13,marginBottom:22}}>
        {[
          {l:"Topics Done",v:`${done}/${total}`,c:"#00c9a7",s:`${total>0?Math.round((done/total)*100):0}% complete`},
          {l:"Avg Score",v:`${avg}%`,c:"#7c3aed",s:scores.length?`${scores.length} attempts`:"Start practicing!"},
          {l:"Day Streak",v:`${streak.count} 🔥`,c:"#f59e0b",s:"Keep going!"},
          plan==="free"&&aiLeft!==null
            ?{l:"AI Left Today",v:aiLeft,c:aiLeft>2?"#00c9a7":"#ef4444",s:`of ${CONFIG.FREE_AI_LIMIT} free/day`}
            :{l:"Plan",v:"PRO ⚡",c:"#00c9a7",s:"Unlimited access"},
        ].map(s=>(
          <Card key={s.l} style={{padding:16}}>
            <div style={{fontSize:10,color:"#ffffff33",letterSpacing:2,marginBottom:8}}>{s.l.toUpperCase()}</div>
            <div style={{fontSize:22,fontWeight:600,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:"#ffffff33",marginTop:4}}>{s.s}</div>
          </Card>
        ))}
      </div>

      {plan==="free"&&(
        <div style={{background:"linear-gradient(135deg,#00c9a710,#7c3aed10)",border:"1px solid #00c9a730",borderRadius:14,padding:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontWeight:600,color:"#00c9a7",fontSize:13}}>🚀 Get Unlimited Access</div>
            <div style={{fontSize:12,color:"#ffffff44",marginTop:4}}>Unlimited AI explanations + mock tests for just {CONFIG.PRO_PRICE_DISPLAY}/month</div>
          </div>
          <Btn onClick={onUpgrade} c="#00c9a7">Upgrade Now →</Btn>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:13}}>
        {SUBJECTS.map(sub=>{
          const ts=sub.units.flatMap(u=>u.topics);
          const d=ts.filter(t=>progress[t.id]?.completed).length;
          return (
            <Card key={sub.id} glow={sub.color} style={{padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:22}}>{sub.icon}</span>
                  <div>
                    <div style={{fontWeight:500,fontSize:13,color:"#fff"}}>{sub.title}</div>
                    <div style={{fontSize:10,color:sub.color,letterSpacing:1,marginTop:2}}>{sub.code}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:600,color:sub.color}}>{d}/{ts.length}</div>
                  <div style={{fontSize:10,color:"#ffffff33"}}>topics</div>
                </div>
              </div>
              <Bar v={d} max={ts.length} c={sub.color}/>
              <div style={{fontSize:10,color:"#ffffff33",marginTop:6}}>{ts.length>0?Math.round((d/ts.length)*100):0}% complete</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  LEARN TAB
// ═══════════════════════════════════════════════════════
function LearnTab({data,setData,plan,tryAI,recordAI}){
  const [sub,setSub]=useState(null);
  const [topic,setTopic]=useState(null);
  const [content,setContent]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [mode,setMode]=useState("explain");
  const progress=data.progress||{};

  const markDone=id=>{
    setData({...data,progress:{...(data.progress||{}),[id]:{completed:true,at:Date.now()}}});
  };

  const SYSTEM=`You are a super friendly MCA tutor for a complete beginner student in India.
RULES:
- Very simple English. No difficult words.
- If you use a technical word, immediately explain it simply in brackets like: Stack (Stack = a pile of books where you take from top)
- ALWAYS give TWO examples: 1) REAL LIFE EXAMPLE (daily life - food, college, phone) 2) REAL-TIME COMPUTER EXAMPLE (actual software using it right now)
- Never just define - always show WHY it matters and HOW it works step by step
- Be warm and encouraging`;

  const load=(t,s,m="explain")=>tryAI(async()=>{
    setLoading(true);setErr("");setContent("");
    const prompts={
      explain:`Teach "${t.title}" from "${s.title}" for Anna University MCA Sem 1.

## 🤔 WHAT IS IT?
[2-3 simple sentences. Explain like to a school friend.]

## 🏠 REAL LIFE EXAMPLE
[Story from daily life - food, college, shopping. Very relatable!]

## 💻 REAL-TIME COMPUTER EXAMPLE
[How a real app uses this right now. Be specific - name the app.]

## 🔢 HOW IT WORKS — STEP BY STEP
[Numbered steps. Simple language. ASCII diagram if helpful.]

## ❓ WHY DO WE NEED IT?
[What problem does it solve?]

## 🎯 KEY EXAM POINTS (must write in exam!)
[5-7 bullet points examiners look for]

## ⚡ QUICK REVISION CARD
[3-4 lines only. Read before exam.]`,

      exam:`Exam writing guide for "${t.title}" from "${s.title}".

## 📋 QUESTION TYPES
[What questions come and mark patterns]

## ✅ WHAT TO WRITE FOR EACH MARK
**2 marks:** [exact points]
**5 marks:** [structure + points]
**10 marks:** [full structure]
**13 marks:** [everything + extra]

## 📝 SAMPLE STRUCTURE (5 marks)
[Show skeleton of a good answer]

## ⚠️ COMMON MISTAKES
[What students write wrong]`,

      glossary:`Word dictionary for "${t.title}" from "${s.title}".
For each term:
**[TERM]** = [One simple sentence explanation]
📌 Example: [tiny real example]
List 8-10 important terms. Simple language only.`,
    };
    try{
      const res=await callAI([{role:"user",content:prompts[m]}],SYSTEM);
      setContent(res); recordAI();
    }catch(e){
      if(e.message==="NO_KEY") setErr("No API key set. Click ⚙ Settings in the top bar → add your Anthropic API key (free at console.anthropic.com)");
      else setErr(`Could not load: ${e.message}. Check your API key in ⚙ Settings.`);
    }
    setLoading(false);
  });

  if(!sub) return (
    <div className="fade">
      <h2 style={{fontSize:17,fontWeight:600,color:"#fff",marginBottom:4}}>Choose a Subject</h2>
      <p style={{color:"#ffffff44",fontSize:12,marginBottom:20}}>AI explains every topic with real-life + computer examples 🙂</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:13}}>
        {SUBJECTS.map(s=>{
          const ts=s.units.flatMap(u=>u.topics);
          const d=ts.filter(t=>progress[t.id]?.completed).length;
          return (
            <Card key={s.id} onClick={()=>setSub(s)} glow={s.color} style={{cursor:"pointer",padding:20}}>
              <div style={{fontSize:26,marginBottom:10}}>{s.icon}</div>
              <div style={{fontWeight:500,fontSize:14,color:"#fff"}}>{s.title}</div>
              <div style={{fontSize:11,color:s.color,marginBottom:13}}>{s.code} · {s.units.length} Units · {ts.length} Topics</div>
              <Bar v={d} max={ts.length} c={s.color}/>
              <div style={{fontSize:10,color:"#ffffff33",marginTop:5}}>{d}/{ts.length} completed</div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if(!topic) return (
    <div className="fade">
      <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:20}}>
        <Btn sm onClick={()=>setSub(null)} c="#ffffff44">← Back</Btn>
        <span style={{fontSize:20}}>{sub.icon}</span>
        <div>
          <div style={{fontWeight:600,color:"#fff",fontSize:15}}>{sub.title}</div>
          <div style={{fontSize:10,color:sub.color,letterSpacing:1}}>{sub.code}</div>
        </div>
      </div>
      {sub.units.map(u=>(
        <div key={u.id} style={{marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:2.5,color:sub.color,fontWeight:700,marginBottom:9,paddingBottom:6,borderBottom:`1px solid ${sub.color}22`}}>
            UNIT {u.unit} — {u.title.toUpperCase()}
          </div>
          {u.topics.map(t=>(
            <div key={t.id} onClick={()=>{setTopic({...t,subject:sub});setContent("");setMode("explain");}}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",borderRadius:10,cursor:"pointer",marginBottom:3,transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#ffffff08"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:18,height:18,borderRadius:5,background:progress[t.id]?.completed?sub.color+"33":"#ffffff08",border:`1px solid ${progress[t.id]?.completed?sub.color:"#ffffff20"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:sub.color,flexShrink:0}}>
                  {progress[t.id]?.completed?"✓":""}
                </div>
                <span style={{fontSize:13,color:progress[t.id]?.completed?"#ffffff66":"#dde1f0"}}>{t.title}</span>
              </div>
              <div style={{display:"flex",gap:5,flexShrink:0}}>{t.marks.map(m=><Badge key={m} c={sub.color} sm>{m}M</Badge>)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const s2=topic.subject;
  return (
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <Btn sm onClick={()=>setTopic(null)} c="#ffffff44">← Topics</Btn>
        <span style={{fontWeight:600,color:"#fff",fontSize:14,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{topic.title}</span>
        {progress[topic.id]?.completed?<Badge c={s2.color}>✓ Done</Badge>:<Btn sm onClick={()=>markDone(topic.id)} c="#00c9a7">✓ Mark Done</Btn>}
      </div>

      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {[["explain","📖 Full Explain"],["exam","🎯 Exam Tips"],["glossary","📚 Word Guide"]].map(([m,l])=>(
          <button key={m} onClick={()=>{setMode(m);if(mode!==m||!content) load(topic,s2,m);}}
            style={{background:mode===m?"#ffffff12":"transparent",border:`1px solid ${mode===m?"#ffffff22":"transparent"}`,color:mode===m?"#fff":"#ffffff55",cursor:"pointer",padding:"8px 15px",borderRadius:8,fontSize:11,transition:"all .18s"}}>
            {l}
          </button>
        ))}
        {content&&<Btn sm onClick={()=>load(topic,s2,mode)} c="#ffffff44">↺ Reload</Btn>}
      </div>

      <div style={{background:"#ffffff05",border:"1px solid #ffffff0d",borderRadius:14,padding:22,minHeight:260}}>
        {loading?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,padding:50,color:"#ffffff33"}}>
            <Spin size={28}/>
            <div className="pulse" style={{fontSize:12}}>AI is preparing your explanation...</div>
            <div style={{fontSize:11,color:"#ffffff22"}}>Usually takes 5–15 seconds 🙏</div>
          </div>
        ):err?(
          <div style={{background:"#ef444412",border:"1px solid #ef444430",borderRadius:10,padding:18}}>
            <div style={{color:"#ef4444",fontWeight:600,marginBottom:8}}>⚠ Could Not Load</div>
            <div style={{fontSize:12,color:"#f87171",lineHeight:1.7}}>{err}</div>
            <div style={{marginTop:12}}><Btn sm onClick={()=>load(topic,s2,mode)} c="#ef4444">Try Again</Btn></div>
          </div>
        ):content?(
          <AIText text={content}/>
        ):(
          <div style={{textAlign:"center",padding:40}}>
            <div style={{fontSize:36,marginBottom:14}}>📖</div>
            <div style={{color:"#ffffff44",fontSize:13,marginBottom:18}}>Click below to load AI explanation</div>
            <Btn onClick={()=>load(topic,s2,mode)} c="#00c9a7">Load Explanation for "{topic.title}"</Btn>
            {plan==="free"&&<div style={{fontSize:11,color:"#ffffff33",marginTop:10}}>{aiUsedToday(data)}/{CONFIG.FREE_AI_LIMIT} AI calls used today</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PRACTICE TAB
// ═══════════════════════════════════════════════════════
function PracticeTab({data,setData,plan,tryAI,recordAI}){
  const [sub,setSub]=useState(null);
  const [topic,setTopic]=useState(null);
  const [q,setQ]=useState(null);
  const [ans,setAns]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [hint,setHint]=useState("");
  const [hintLoad,setHintLoad]=useState(false);

  const qs=topic?QB[topic.id]||[]:[];

  const getHint=()=>tryAI(async()=>{
    setHintLoad(true);setHint("");
    try{
      const r=await callAI([{role:"user",content:`Give a 3-4 line hint in simple English for: "${q.question}". Just a small nudge — don't give the full answer.`}],"Helpful tutor. Simple hints only.");
      setHint(r); recordAI();
    }catch{setHint("Could not load hint. Check ⚙ Settings for API key.");}
    setHintLoad(false);
  });

  const evaluate=()=>tryAI(async()=>{
    if(!ans.trim()) return;
    setLoading(true);setResult(null);setErr("");
    try{
      const r=await callAI([{role:"user",content:`Evaluate this ${q.marks}-mark answer for Anna University MCA.
QUESTION: ${q.question}
STUDENT ANSWER: ${ans}
KEY POINTS: ${q.kp.map((p,i)=>`${i+1}. ${p}`).join("\n")}

Reply in this EXACT format:
MARKS_AWARDED: [number]/${q.marks}

✅ WHAT YOU GOT RIGHT:
- [point]

❌ WHAT YOU MISSED:
- [concept in simple words]

💡 HOW TO IMPROVE:
- [suggestion]

📝 GRADE: [A/B/C/D]

🔁 PERFECT ANSWER SHOULD HAVE:
[2-3 lines]`}],"Anna University exam evaluator. Simple English. Be kind and specific.");
      const m=r.match(/MARKS_AWARDED:\s*(\d+)/);
      const got=m?Math.min(parseInt(m[1]),q.marks):0;
      setResult({text:r,got});
      const sc=[...(data.scores||[]),{id:topic.id,got,max:q.marks,date:Date.now()}];
      setData({...data,scores:sc});
      recordAI();
    }catch(e){
      if(e.message==="NO_KEY") setErr("No API key. Go to ⚙ Settings → add your API key.");
      else setErr("Evaluation failed. Check connection and API key in ⚙ Settings.");
    }
    setLoading(false);
  });

  if(!sub) return (
    <div className="fade">
      <h2 style={{fontSize:17,fontWeight:600,color:"#fff",marginBottom:4}}>Practice Questions</h2>
      <p style={{color:"#ffffff44",fontSize:12,marginBottom:20}}>Exam-style 2/5/10/13 mark questions with AI evaluation + hints 💪</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:13}}>
        {SUBJECTS.map(s=>{
          const n=s.units.flatMap(u=>u.topics).filter(t=>QB[t.id]).length;
          return(
            <Card key={s.id} onClick={()=>setSub(s)} glow={s.color} style={{cursor:"pointer"}}>
              <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
              <div style={{fontWeight:500,fontSize:13,color:"#fff"}}>{s.title}</div>
              <div style={{fontSize:11,color:s.color,marginTop:4}}>{s.code} · {n} question set{n!==1?"s":""}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if(!topic) return (
    <div className="fade">
      <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:20}}>
        <Btn sm onClick={()=>setSub(null)} c="#ffffff44">← Back</Btn>
        <span style={{fontWeight:600,color:"#fff"}}>{sub.title}</span>
      </div>
      {sub.units.map(u=>(
        <div key={u.id} style={{marginBottom:18}}>
          <div style={{fontSize:10,letterSpacing:2.5,color:sub.color,fontWeight:700,marginBottom:8}}>UNIT {u.unit} — {u.title.toUpperCase()}</div>
          {u.topics.map(t=>{
            const has=QB[t.id];
            return(
              <div key={t.id} onClick={()=>has&&setTopic({...t,subject:sub})}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 13px",borderRadius:10,cursor:has?"pointer":"default",opacity:has?1:.35,marginBottom:3,transition:"all .15s"}}
                onMouseEnter={e=>has&&(e.currentTarget.style.background="#ffffff08")}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:13}}>{t.title}</span>
                {has?<Badge c={sub.color}>{QB[t.id].length} Qs</Badge>:<span style={{fontSize:10,color:"#ffffff22"}}>coming soon</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  if(!q) return (
    <div className="fade">
      <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:20}}>
        <Btn sm onClick={()=>setTopic(null)} c="#ffffff44">← Topics</Btn>
        <span style={{fontWeight:600,color:"#fff"}}>{topic.title}</span>
      </div>
      {qs.map(qq=>(
        <Card key={qq.id} onClick={()=>{setQ(qq);setAns("");setResult(null);setHint("");setErr("");}} style={{marginBottom:10,cursor:"pointer"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <Badge c={qq.marks>=10?"#ef4444":qq.marks>=5?"#f59e0b":"#00c9a7"}>{qq.marks} Marks</Badge>
            <span style={{fontSize:10,color:"#ffffff33"}}>{qq.marks>=10?"Long Answer":qq.marks>=5?"Short Answer":"Very Short"}</span>
          </div>
          <div style={{fontSize:13,color:"#dde1f0",lineHeight:1.65}}>{qq.question}</div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="fade">
      <Btn sm onClick={()=>setQ(null)} c="#ffffff44">← Questions</Btn>
      <Card style={{margin:"14px 0"}}>
        <Badge c={q.marks>=10?"#ef4444":q.marks>=5?"#f59e0b":"#00c9a7"}>{q.marks} Marks</Badge>
        <div style={{fontSize:15,color:"#fff",fontWeight:500,lineHeight:1.65,marginTop:10}}>{q.question}</div>
      </Card>

      <div style={{marginBottom:12}}>
        <Btn sm onClick={getHint} c="#f59e0b">{hintLoad?<><Spin/> Loading...</>:"💡 Get a Hint"}</Btn>
        {hint&&<div style={{marginTop:10,background:"#f59e0b0e",border:"1px solid #f59e0b25",borderRadius:10,padding:13,fontSize:12,color:"#fcd34d",lineHeight:1.75}}>{hint}</div>}
      </div>

      <textarea value={ans} onChange={e=>setAns(e.target.value)} rows={9}
        placeholder={`Write your ${q.marks}-mark answer here in your own words...\n\nTip: Don't copy-paste — write yourself. That's how you actually learn! 😊`}
        style={{width:"100%",background:"#ffffff08",border:"1px solid #ffffff15",borderRadius:12,padding:16,color:"#dde1f0",fontSize:13,lineHeight:1.8,resize:"vertical",outline:"none"}}/>

      <div style={{marginTop:12,display:"flex",gap:10,flexWrap:"wrap"}}>
        <Btn onClick={evaluate} disabled={loading||!ans.trim()} c="#00c9a7">
          {loading?<><Spin/> Evaluating your answer...</>:"◈ Submit for AI Evaluation"}
        </Btn>
        <Btn sm onClick={()=>{setAns("");setResult(null);setHint("");}} c="#ffffff44">Clear</Btn>
      </div>

      {err&&<div style={{marginTop:12,background:"#ef444412",border:"1px solid #ef444430",borderRadius:10,padding:13,color:"#f87171",fontSize:12,lineHeight:1.6}}>{err}</div>}

      {result&&(
        <div className="fade" style={{marginTop:20,background:"#ffffff05",border:"1px solid #ffffff0d",borderRadius:14,padding:22}}>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:18,background:"#ffffff08",borderRadius:10,padding:"12px 16px"}}>
            <div style={{fontSize:26,fontWeight:600,color:result.got/q.marks>=0.7?"#00c9a7":result.got/q.marks>=0.4?"#f59e0b":"#ef4444"}}>{result.got}/{q.marks}</div>
            <div>
              <div style={{fontSize:13,color:"#fff"}}>Marks Awarded</div>
              <div style={{fontSize:11,color:"#ffffff44"}}>{Math.round((result.got/q.marks)*100)}% — {result.got/q.marks>=0.7?"Great work! 🎉":result.got/q.marks>=0.4?"Getting there! 💪":"Revise and retry 📖"}</div>
            </div>
          </div>
          <AIText text={result.text}/>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  LAB TAB
// ═══════════════════════════════════════════════════════
function LabTab({plan,tryAI,recordAI}){
  const [ex,setEx]=useState(null);
  const [code,setCode]=useState("");
  const [tab,setTab]=useState("code");
  const [fb,setFb]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const evaluate=()=>tryAI(async()=>{
    setLoading(true);setFb(null);setErr("");
    try{
      const r=await callAI([{role:"user",content:`Evaluate this ${ex.type} code for MCA lab exercise.
EXERCISE: ${ex.title}
STUDENT CODE:\n${code}
MODEL SOLUTION:\n${ex.solution}
TEST CASES: ${ex.tests.join(" | ")}

Reply in this format:
CORRECTNESS: [n]/10
EFFICIENCY: [n]/10

✅ WHAT'S WORKING:
- [correct part]

🐛 BUGS / ISSUES:
- [specific issue]

💡 HOW TO FIX:
- [specific fix]

📊 TEST RESULTS:
- [which tests pass/fail]

📝 GRADE: [A/B/C/D]

🚀 ONE IMPROVEMENT:
[one suggestion]`}],"Friendly MCA lab evaluator. Simple English. Be encouraging.");
      setFb(r); recordAI();
    }catch(e){
      if(e.message==="NO_KEY") setErr("No API key. Go to ⚙ Settings → add your key.");
      else setErr("Evaluation failed. Check connection.");
    }
    setLoading(false);
  });

  if(!ex) return (
    <div className="fade">
      <h2 style={{fontSize:17,fontWeight:600,color:"#fff",marginBottom:4}}>Lab Exercises</h2>
      <p style={{color:"#ffffff44",fontSize:12,marginBottom:20}}>Code → AI feedback → fix bugs → learn 🛠️</p>
      {LABS.map(l=>{
        const s=SUBJECTS.find(x=>x.id===l.sub);
        return(
          <Card key={l.id} onClick={()=>{setEx(l);setCode(l.starter);setFb(null);setTab("code");setErr("");}} style={{marginBottom:11,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:500,fontSize:14,color:"#fff",marginBottom:5}}>{l.title}</div>
                <div style={{fontSize:12,color:"#ffffff44",marginBottom:10}}>{l.desc}</div>
                <div style={{display:"flex",gap:8}}>
                  <Badge c={l.type==="SQL"?"#06b6d4":l.type==="Python"?"#84cc16":"#f59e0b"}>{l.type}</Badge>
                  {s&&<Badge c={s.color}>{s.code}</Badge>}
                </div>
              </div>
              <span style={{fontSize:26}}>{l.type==="SQL"?"🗃️":l.type==="Python"?"🐍":"⚙️"}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="fade">
      <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:14}}>
        <Btn sm onClick={()=>setEx(null)} c="#ffffff44">← Labs</Btn>
        <span style={{fontWeight:600,color:"#fff",fontSize:14}}>{ex.title}</span>
        <Badge c={ex.type==="SQL"?"#06b6d4":ex.type==="Python"?"#84cc16":"#f59e0b"}>{ex.type}</Badge>
      </div>
      <div style={{background:"#f59e0b0d",border:"1px solid #f59e0b22",borderRadius:10,padding:11,marginBottom:14,fontSize:12,color:"#fcd34d"}}>📌 {ex.desc}</div>

      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["code","✏️ Your Code"],["solution","🔑 Solution"],["tests","🧪 Tests"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{background:tab===t?"#ffffff12":"transparent",border:`1px solid ${tab===t?"#ffffff22":"transparent"}`,color:tab===t?"#fff":"#ffffff44",cursor:"pointer",padding:"8px 15px",borderRadius:8,fontSize:11,transition:"all .18s"}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="tests"?(
        <div>{ex.tests.map((t,i)=><div key={i} style={{padding:"10px 13px",background:"#00c9a70d",border:"1px solid #00c9a720",borderRadius:8,marginBottom:8,fontSize:12,color:"#00c9a7",fontFamily:"monospace"}}>✓ {t}</div>)}</div>
      ):(
        <>
          <textarea value={tab==="solution"?ex.solution:code} onChange={e=>tab==="code"&&setCode(e.target.value)}
            readOnly={tab==="solution"} rows={16}
            style={{width:"100%",background:"#090d1a",border:"1px solid #ffffff12",borderRadius:12,padding:15,color:tab==="solution"?"#a78bfa":"#84cc16",fontSize:12,lineHeight:1.85,resize:"vertical",outline:"none",fontFamily:"monospace"}}/>
          {tab==="code"&&(
            <div style={{marginTop:11,display:"flex",gap:10}}>
              <Btn onClick={evaluate} disabled={loading} c="#00c9a7">
                {loading?<><Spin/> Evaluating...</>:"⬡ Evaluate My Code"}
              </Btn>
              <Btn sm onClick={()=>setCode(ex.starter)} c="#ffffff44">Reset</Btn>
            </div>
          )}
        </>
      )}

      {err&&<div style={{marginTop:12,background:"#ef444412",border:"1px solid #ef444430",borderRadius:10,padding:13,color:"#f87171",fontSize:12}}>{err}</div>}
      {fb&&(
        <div className="fade" style={{marginTop:20,background:"#ffffff05",border:"1px solid #ffffff0d",borderRadius:14,padding:22}}>
          <div style={{fontWeight:600,color:"#00c9a7",fontSize:12,letterSpacing:1,marginBottom:14}}>◈ AI CODE FEEDBACK</div>
          <AIText text={fb}/>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MOCK TEST TAB
// ═══════════════════════════════════════════════════════
function TestTab({data,setData,plan,tryAI,recordAI}){
  const [phase,setPhase]=useState("setup");
  const [cfg,setCfg]=useState({subId:"ds",dur:30});
  const [qs,setQs]=useState([]);
  const [answers,setAnswers]=useState({});
  const [timeLeft,setTimeLeft]=useState(0);
  const [results,setResults]=useState(null);
  const [evaling,setEvaling]=useState(false);
  const timer=useRef(null);

  const start=()=>{
    const sub=SUBJECTS.find(s=>s.id===cfg.subId);
    const pool=[];
    sub.units.forEach(u=>u.topics.forEach(t=>{const q=QB[t.id];if(q)pool.push(...q);}));
    const sel=[
      ...pool.filter(q=>q.marks===2).slice(0,3),
      ...pool.filter(q=>q.marks===5).slice(0,3),
      ...pool.filter(q=>q.marks===10).slice(0,1),
      ...pool.filter(q=>q.marks===13).slice(0,1),
    ];
    if(!sel.length){Object.keys(QB).filter(k=>k.startsWith(cfg.subId)).forEach(k=>pool.push(...QB[k]));sel.push(...pool.slice(0,5));}
    setQs(sel);setAnswers({});setTimeLeft(cfg.dur*60);setPhase("test");
  };

  useEffect(()=>{
    if(phase==="test"){
      timer.current=setInterval(()=>setTimeLeft(t=>{if(t<=1){clearInterval(timer.current);handleSubmit();return 0;}return t-1;}),1000);
    }
    return()=>clearInterval(timer.current);
  },[phase]);

  const handleSubmit=()=>{
    clearInterval(timer.current);
    tryAI(async()=>{
      setPhase("results");setEvaling(true);
      const items=[];
      for(const q of qs){
        const a=answers[q.id]||"";
        if(!a.trim()){items.push({q,got:0,fb:"Not attempted."});continue;}
        try{
          const r=await callAI([{role:"user",content:`Evaluate (${q.marks}M): ${q.question}\nAnswer: ${a}\nKey: ${q.kp.join(", ")}\nReply ONLY: MARKS:[n]/${q.marks} | [one simple feedback sentence]`}],"Be brief and fair.");
          const m=r.match(/MARKS:(\d+)/);
          items.push({q,got:m?Math.min(parseInt(m[1]),q.marks):0,fb:r});
          recordAI();
        }catch{items.push({q,got:0,fb:"Evaluation failed — check API key."});}
      }
      const total=items.reduce((s,r)=>s+r.got,0),max=items.reduce((s,r)=>s+r.q.marks,0);
      const sc=[...(data.scores||[]),...items.map(i=>({id:i.q.id,got:i.got,max:i.q.marks,date:Date.now()}))];
      setData({...data,scores:sc});
      setResults({items,total,max});setEvaling(false);
    });
  };

  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  if(phase==="setup") return (
    <div className="fade">
      <h2 style={{fontSize:17,fontWeight:600,color:"#fff",marginBottom:4}}>Mock Test</h2>
      <p style={{color:"#ffffff44",fontSize:12,marginBottom:20}}>Timed exam simulation with AI scoring 🎯</p>
      <Card style={{maxWidth:520}}>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,color:"#ffffff33",letterSpacing:2,marginBottom:10}}>SELECT SUBJECT</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {SUBJECTS.map(s=>(
              <button key={s.id} onClick={()=>setCfg(c=>({...c,subId:s.id}))}
                style={{padding:"8px 13px",background:cfg.subId===s.id?s.color+"22":"#ffffff08",border:`1px solid ${cfg.subId===s.id?s.color:"#ffffff15"}`,borderRadius:8,color:cfg.subId===s.id?s.color:"#ffffff44",cursor:"pointer",fontSize:11,fontWeight:700}}>
                {s.icon} {s.code}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:10,color:"#ffffff33",letterSpacing:2,marginBottom:10}}>DURATION</div>
          <div style={{display:"flex",gap:8}}>
            {[30,60,90].map(d=>(
              <button key={d} onClick={()=>setCfg(c=>({...c,dur:d}))}
                style={{flex:1,padding:"10px",background:cfg.dur===d?"#00c9a722":"#ffffff08",border:`1px solid ${cfg.dur===d?"#00c9a7":"#ffffff15"}`,borderRadius:8,color:cfg.dur===d?"#00c9a7":"#ffffff44",cursor:"pointer",fontSize:12}}>
                {d} min
              </button>
            ))}
          </div>
        </div>
        <Btn full onClick={start} c="#00c9a7">◉ Start Mock Test</Btn>
      </Card>
    </div>
  );

  if(phase==="test") return (
    <div className="fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,position:"sticky",top:0,background:"#07070e",padding:"8px 0",zIndex:10}}>
        <div style={{fontWeight:600,color:"#fff"}}>Mock Test · {qs.length} Questions</div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:22,fontWeight:600,color:timeLeft<300?"#ef4444":"#00c9a7",fontFamily:"monospace"}}>{fmt(timeLeft)}</div>
          <Btn sm onClick={handleSubmit} danger>Submit Now</Btn>
        </div>
      </div>
      <Bar v={Object.keys(answers).length} max={qs.length} c="#00c9a7"/>
      <div style={{fontSize:11,color:"#ffffff33",marginBottom:14,marginTop:4}}>{Object.keys(answers).length}/{qs.length} answered</div>
      {qs.map((q,i)=>(
        <Card key={q.id} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
            <span style={{fontSize:11,color:"#ffffff33"}}>Question {i+1}</span>
            <Badge c={q.marks>=10?"#ef4444":q.marks>=5?"#f59e0b":"#00c9a7"}>{q.marks} Marks</Badge>
          </div>
          <div style={{fontSize:14,color:"#fff",fontWeight:500,marginBottom:11,lineHeight:1.65}}>{q.question}</div>
          <textarea value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))}
            placeholder="Your answer..." rows={5}
            style={{width:"100%",background:"#ffffff07",border:"1px solid #ffffff12",borderRadius:8,padding:12,color:"#dde1f0",fontSize:12,resize:"vertical",outline:"none",fontFamily:"inherit"}}/>
        </Card>
      ))}
      <Btn full onClick={handleSubmit} c="#00c9a7">◈ Submit & Get AI Results</Btn>
    </div>
  );

  return (
    <div className="fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:17,fontWeight:600,color:"#fff"}}>Test Results</h2>
        <Btn sm onClick={()=>setPhase("setup")} c="#ffffff44">New Test</Btn>
      </div>
      {evaling?(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:60,color:"#ffffff33"}}>
          <Spin size={28}/><div className="pulse" style={{fontSize:12}}>AI is marking your answers...</div>
        </div>
      ):results&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:22}}>
            {[
              {l:"Total Score",v:`${results.total}/${results.max}`,c:results.total/results.max>=0.5?"#00c9a7":"#ef4444"},
              {l:"Percentage",v:`${Math.round((results.total/results.max)*100)}%`,c:"#7c3aed"},
              {l:"Attempted",v:`${results.items.filter(r=>r.got>0).length}/${results.items.length}`,c:"#f59e0b"},
            ].map(s=>(
              <Card key={s.l} style={{textAlign:"center",padding:16}}>
                <div style={{fontSize:10,color:"#ffffff33",letterSpacing:2,marginBottom:8}}>{s.l.toUpperCase()}</div>
                <div style={{fontSize:24,fontWeight:600,color:s.c}}>{s.v}</div>
              </Card>
            ))}
          </div>
          {results.items.map((r,i)=>(
            <Card key={i} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7,gap:10}}>
                <span style={{fontSize:12,color:"#ffffff44",flex:1,minWidth:0}}>Q{i+1}: {r.q.question.slice(0,60)}...</span>
                <span style={{fontWeight:700,color:r.got/r.q.marks>=0.6?"#00c9a7":"#ef4444",flexShrink:0}}>{r.got}/{r.q.marks}</span>
              </div>
              <div style={{fontSize:11,color:"#ffffff44",lineHeight:1.65}}>{r.fb}</div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}




// // @ts-nocheck

// import { useState, useEffect, useRef, useCallback } from 'react';

// // ═══════════════════════════════════════════════════════════════════
// //  STUDYFORGE — Production-Ready MCA Study Platform
// //  ✅ Login / Register (Supabase-ready, localStorage for demo)
// //  ✅ Free / Pro / Admin tiers
// //  ✅ API Key input (friends can use their own key)
// //  ✅ Razorpay payment flow (wired up, needs live keys)
// //  ✅ Admin Dashboard — users, revenue, usage stats
// //  ✅ Full study app (Learn, Practice, Lab, Mock Test)
// //  ✅ Progress saved per user account
// // ═══════════════════════════════════════════════════════════════════

// // ── CONFIG ─────────────────────────────────────────────────────────
// const CONFIG = {
//   appName: 'StudyForge',
//   tagline: 'MCA · Anna University · Sem 1',
//   OWNER_EMAIL: 'whitespace.creativedesign@gmail.com', // ← change this to YOUR email
//   RAZORPAY_KEY: 'rzp_test_XXXXXXXXXXXX', // ← paste your Razorpay test key
//   ANTHROPIC_KEY:
//     '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', // ← set your key here OR users enter their own
//   FREE_AI_LIMIT: 5, // AI calls per day for free users
//   PRO_PRICE: 9900, // ₹99 in paise (Razorpay uses paise)
//   PRO_PRICE_DISPLAY: '₹99',
// };

// // ── PLANS ──────────────────────────────────────────────────────────
// const PLANS = {
//   free: {
//     label: 'Free',
//     color: '#ffffff55',
//     aiLimit: 5,
//     mockTests: 2,
//     badge: 'FREE',
//   },
//   pro: {
//     label: 'Pro',
//     color: '#00c9a7',
//     aiLimit: 999,
//     mockTests: 99,
//     badge: 'PRO',
//   },
//   admin: {
//     label: 'Admin',
//     color: '#f59e0b',
//     aiLimit: 999,
//     mockTests: 99,
//     badge: 'ADMIN',
//   },
// };

// // ── SUBJECTS (abbreviated for space — same full data as before) ────
// const SUBJECTS = [
//   {
//     id: 'ds',
//     code: 'DS',
//     title: 'Data Structures & Algorithms',
//     color: '#00c9a7',
//     icon: '🌲',
//     units: [
//       {
//         id: 'ds1',
//         unit: 1,
//         title: 'Linear Data Structures',
//         topics: [
//           { id: 'ds1t1', title: 'Abstract Data Types (ADT)', marks: [2, 5] },
//           { id: 'ds1t2', title: 'Stack & Applications', marks: [2, 5, 10, 13] },
//           {
//             id: 'ds1t3',
//             title: 'Queue & Circular Queue',
//             marks: [2, 5, 10, 13],
//           },
//           { id: 'ds1t4', title: 'Linked Lists', marks: [5, 10, 13] },
//         ],
//       },
//       {
//         id: 'ds2',
//         unit: 2,
//         title: 'Non-Linear Data Structures',
//         topics: [
//           {
//             id: 'ds2t1',
//             title: 'Binary Tree & Traversals',
//             marks: [2, 5, 10, 13],
//           },
//           { id: 'ds2t2', title: 'BST & AVL Tree', marks: [5, 10, 13] },
//           { id: 'ds2t3', title: 'Huffman Algorithm', marks: [5, 10, 13] },
//         ],
//       },
//       {
//         id: 'ds3',
//         unit: 3,
//         title: 'Graphs',
//         topics: [
//           {
//             id: 'ds3t1',
//             title: 'Graph Representation & Traversals',
//             marks: [2, 5, 10],
//           },
//           {
//             id: 'ds3t2',
//             title: "Dijkstra's & Bellman-Ford",
//             marks: [5, 10, 13],
//           },
//           { id: 'ds3t3', title: "Prim's & Kruskal's MST", marks: [5, 10, 13] },
//         ],
//       },
//       {
//         id: 'ds4',
//         unit: 4,
//         title: 'Algorithm Design',
//         topics: [
//           {
//             id: 'ds4t1',
//             title: 'Divide & Conquer, Merge/Quick Sort',
//             marks: [5, 10, 13],
//           },
//           {
//             id: 'ds4t2',
//             title: 'Greedy & Dynamic Programming',
//             marks: [5, 10, 13],
//           },
//           { id: 'ds4t3', title: 'Backtracking', marks: [5, 10] },
//         ],
//       },
//       {
//         id: 'ds5',
//         unit: 5,
//         title: 'Algorithm Analysis',
//         topics: [
//           { id: 'ds5t1', title: 'Asymptotic Notations', marks: [2, 5, 10] },
//           { id: 'ds5t2', title: 'Recurrence Relations', marks: [5, 10, 13] },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'oose',
//     code: 'OOSE',
//     title: 'OO Software Engineering',
//     color: '#7c3aed',
//     icon: '🔷',
//     units: [
//       {
//         id: 'oo1',
//         unit: 1,
//         title: 'SDLC Models',
//         topics: [
//           {
//             id: 'oo1t1',
//             title: 'Waterfall & Prototyping Model',
//             marks: [5, 10, 13],
//           },
//           { id: 'oo1t2', title: 'Spiral & XP Models', marks: [5, 10, 13] },
//         ],
//       },
//       {
//         id: 'oo2',
//         unit: 2,
//         title: 'OO Requirements',
//         topics: [
//           { id: 'oo2t1', title: 'Use Case & SRS', marks: [5, 10, 13] },
//           { id: 'oo2t2', title: 'OO Analysis & Classes', marks: [5, 10, 13] },
//         ],
//       },
//       {
//         id: 'oo3',
//         unit: 3,
//         title: 'OO Design',
//         topics: [
//           {
//             id: 'oo3t1',
//             title: 'Sequence & Class Diagrams',
//             marks: [5, 10, 13],
//           },
//           {
//             id: 'oo3t2',
//             title: 'OOD Methods & Case Studies',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'oo4',
//         unit: 4,
//         title: 'Testing & Maintenance',
//         topics: [
//           { id: 'oo4t1', title: 'Testing Types & Tools', marks: [5, 10, 13] },
//           { id: 'oo4t2', title: 'Software Maintenance', marks: [5, 10] },
//         ],
//       },
//       {
//         id: 'oo5',
//         unit: 5,
//         title: 'Quality & Metrics',
//         topics: [
//           { id: 'oo5t1', title: 'OO Metrics & Estimation', marks: [5, 10, 13] },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'maths',
//     code: 'MATHS',
//     title: 'Mathematics for Computing',
//     color: '#f59e0b',
//     icon: '📐',
//     units: [
//       {
//         id: 'ma1',
//         unit: 1,
//         title: 'Matrices & Eigenvalues',
//         topics: [
//           {
//             id: 'ma1t1',
//             title: 'Rank & System of Equations',
//             marks: [5, 10, 13],
//           },
//           {
//             id: 'ma1t2',
//             title: 'Eigenvalues & Cayley-Hamilton',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'ma2',
//         unit: 2,
//         title: 'Probability',
//         topics: [
//           {
//             id: 'ma2t1',
//             title: 'Probability Laws & Bayes Theorem',
//             marks: [5, 10, 13],
//           },
//           {
//             id: 'ma2t2',
//             title: 'Distributions (Binomial, Normal, etc.)',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'ma3',
//         unit: 3,
//         title: '2D Random Variables',
//         topics: [
//           {
//             id: 'ma3t1',
//             title: 'Joint Distributions & Correlation',
//             marks: [5, 10, 13],
//           },
//           {
//             id: 'ma3t2',
//             title: 'Regression & Central Limit Theorem',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'ma4',
//         unit: 4,
//         title: 'Hypothesis Testing',
//         topics: [
//           {
//             id: 'ma4t1',
//             title: 't-test, z-test, Chi-Square',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'ma5',
//         unit: 5,
//         title: 'Design of Experiments',
//         topics: [
//           {
//             id: 'ma5t1',
//             title: 'ANOVA & CRD, Latin Square',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'dbms',
//     code: 'DBMS',
//     title: 'Database Management Systems',
//     color: '#06b6d4',
//     icon: '🗃️',
//     units: [
//       {
//         id: 'db1',
//         unit: 1,
//         title: 'Relational Model',
//         topics: [
//           {
//             id: 'db1t1',
//             title: 'ER Model & Relational Algebra',
//             marks: [5, 10, 13],
//           },
//           { id: 'db1t2', title: 'Normalization 1NF–5NF', marks: [5, 10, 13] },
//         ],
//       },
//       {
//         id: 'db2',
//         unit: 2,
//         title: 'Parallel & Distributed DB',
//         topics: [
//           {
//             id: 'db2t1',
//             title: 'ACID & Concurrency Control',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'db3',
//         unit: 3,
//         title: 'XML & Web Databases',
//         topics: [
//           { id: 'db3t1', title: 'XML, DTD, JDBC, PHP', marks: [5, 10, 13] },
//         ],
//       },
//       {
//         id: 'db4',
//         unit: 4,
//         title: 'NoSQL Databases',
//         topics: [
//           {
//             id: 'db4t1',
//             title: 'MongoDB CRUD & CAP Theorem',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'db5',
//         unit: 5,
//         title: 'Data Warehousing & Mining',
//         topics: [
//           {
//             id: 'db5t1',
//             title: 'OLAP, Star Schema, Apriori',
//             marks: [5, 10, 13],
//           },
//           { id: 'db5t2', title: 'Decision Tree & k-Means', marks: [5, 10, 13] },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'rm',
//     code: 'RM',
//     title: 'Research Methodology & IPR',
//     color: '#ec4899',
//     icon: '🔬',
//     units: [
//       {
//         id: 'rm1',
//         unit: 1,
//         title: 'Research Methodology Intro',
//         topics: [
//           {
//             id: 'rm1t1',
//             title: 'Types, Approaches & Research Process',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'rm2',
//         unit: 2,
//         title: 'Research Design',
//         topics: [
//           {
//             id: 'rm2t1',
//             title: 'Experimental Design & Sampling',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'rm3',
//         unit: 3,
//         title: 'Tools & Report Writing',
//         topics: [
//           {
//             id: 'rm3t1',
//             title: 'Zotero, LaTeX, Plagiarism Tools',
//             marks: [2, 5],
//           },
//           {
//             id: 'rm3t2',
//             title: 'Hypothesis Testing & Report Writing',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'rm4',
//         unit: 4,
//         title: 'Intellectual Property Rights',
//         topics: [
//           {
//             id: 'rm4t1',
//             title: 'IPR, Trademarks, WIPO, WTO',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'rm5',
//         unit: 5,
//         title: 'Patents',
//         topics: [
//           {
//             id: 'rm5t1',
//             title: 'Patent Filing, Licensing & Agents',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'eng',
//     code: 'ENG',
//     title: 'Technical Communication',
//     color: '#f97316',
//     icon: '💬',
//     units: [
//       {
//         id: 'en1',
//         unit: 1,
//         title: 'One-to-One Communication',
//         topics: [
//           { id: 'en1t1', title: 'Telephone & Formal Writing', marks: [5, 10] },
//         ],
//       },
//       {
//         id: 'en2',
//         unit: 2,
//         title: 'One-to-Many Communication',
//         topics: [
//           {
//             id: 'en2t1',
//             title: 'Memos, Circulars & Notices',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'en3',
//         unit: 3,
//         title: 'Narration',
//         topics: [
//           {
//             id: 'en3t1',
//             title: 'Formal Letter & Complaint Writing',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'en4',
//         unit: 4,
//         title: 'Description',
//         topics: [
//           {
//             id: 'en4t1',
//             title: 'Product Description & Essay Writing',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'en5',
//         unit: 5,
//         title: 'Comparison & Contrast',
//         topics: [
//           {
//             id: 'en5t1',
//             title: 'Analytical Essays & Presentations',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 'py',
//     code: 'PYTHON',
//     title: 'Python Programming',
//     color: '#84cc16',
//     icon: '🐍',
//     units: [
//       {
//         id: 'py1',
//         unit: 1,
//         title: 'Python Basics',
//         topics: [
//           {
//             id: 'py1t1',
//             title: 'Variables, Operators & Conditionals',
//             marks: [2, 5, 10],
//           },
//           {
//             id: 'py1t2',
//             title: 'Loops, Functions & Recursion',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'py2',
//         unit: 2,
//         title: 'Data Types',
//         topics: [
//           {
//             id: 'py2t1',
//             title: 'Lists, Tuples, Sets, Dicts',
//             marks: [5, 10, 13],
//           },
//           { id: 'py2t2', title: 'Strings & Modules', marks: [5, 10] },
//         ],
//       },
//       {
//         id: 'py3',
//         unit: 3,
//         title: 'File & Exception Handling',
//         topics: [
//           {
//             id: 'py3t1',
//             title: 'File Operations & Exceptions',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//       {
//         id: 'py4',
//         unit: 4,
//         title: 'NumPy, Pandas, Matplotlib',
//         topics: [
//           { id: 'py4t1', title: 'NumPy & Pandas Basics', marks: [5, 10, 13] },
//           { id: 'py4t2', title: 'Matplotlib & Plotly', marks: [5, 10] },
//         ],
//       },
//       {
//         id: 'py5',
//         unit: 5,
//         title: 'OOP in Python',
//         topics: [
//           {
//             id: 'py5t1',
//             title: 'Classes, Inheritance & Polymorphism',
//             marks: [5, 10, 13],
//           },
//           {
//             id: 'py5t2',
//             title: 'Towers of Hanoi & Lab Programs',
//             marks: [5, 10, 13],
//           },
//         ],
//       },
//     ],
//   },
// ];

// // ── QUESTION BANK (sample — same full bank as v2) ──────────────────
// const QB = {
//   ds1t2: [
//     {
//       id: 'q1',
//       marks: 2,
//       question: 'Define Stack. What is LIFO? Give one real example.',
//       kp: [
//         'LIFO = Last In First Out',
//         'push/pop/peek operations',
//         'Example: pile of plates or browser back button',
//       ],
//     },
//     {
//       id: 'q2',
//       marks: 5,
//       question:
//         'Explain Stack operations (push, pop, peek) with algorithm and example.',
//       kp: [
//         'Stack definition',
//         'push with overflow check',
//         'pop with underflow check',
//         'peek',
//         'example with diagram',
//       ],
//     },
//     {
//       id: 'q3',
//       marks: 10,
//       question:
//         'Explain Stack with array implementation in C. List all applications.',
//       kp: [
//         'Complete C code',
//         'overflow/underflow',
//         'display function',
//         'function calls',
//         'expression evaluation',
//         'undo/redo',
//         'browser history',
//       ],
//     },
//     {
//       id: 'q4',
//       marks: 13,
//       question:
//         "Implement Stack in C. Explain postfix evaluation using stack for '5 3 + 2 *'. List all real-world applications.",
//       kp: [
//         'Full C code',
//         'postfix algorithm',
//         'step-by-step trace 5 3 + 2 * = 16',
//         'all applications',
//         'advantages & limits',
//       ],
//     },
//   ],
//   oo1t1: [
//     {
//       id: 'q5',
//       marks: 5,
//       question: 'Explain Waterfall Model with all phases and a neat diagram.',
//       kp: [
//         'All 6 phases',
//         'sequential flow',
//         'output of each phase',
//         'advantages',
//         'disadvantages',
//       ],
//     },
//     {
//       id: 'q6',
//       marks: 10,
//       question:
//         'Compare Waterfall, Prototyping, and Spiral models. When is each used?',
//       kp: [
//         'Waterfall phases',
//         'Prototyping cycle',
//         'Spiral 4 quadrants',
//         'comparison table',
//         'selection criteria',
//       ],
//     },
//   ],
//   ma2t1: [
//     {
//       id: 'q7',
//       marks: 5,
//       question: "State Bayes' Theorem. Apply it to a medical test example.",
//       kp: [
//         'Formula P(A|B)',
//         'prior probability',
//         'posterior probability',
//         'step-by-step example',
//         'real scenario',
//       ],
//     },
//   ],
//   py1t2: [
//     {
//       id: 'q8',
//       marks: 5,
//       question: 'Explain for loop and while loop in Python with examples.',
//       kp: [
//         'for loop syntax',
//         'while loop syntax',
//         'break & continue',
//         'range() function',
//         'example programs',
//       ],
//     },
//     {
//       id: 'q9',
//       marks: 10,
//       question:
//         'Write Python programs using loops, break, continue. Also explain recursive functions.',
//       kp: [
//         'for loop example',
//         'while loop example',
//         'break use case',
//         'continue use case',
//         'recursive factorial',
//         'recursion vs iteration',
//       ],
//     },
//   ],
//   db1t2: [
//     {
//       id: 'q10',
//       marks: 10,
//       question:
//         'Explain 1NF, 2NF, 3NF normalization with examples and the problems they solve.',
//       kp: [
//         'Redundancy problem',
//         '1NF atomic values',
//         '2NF no partial dependency',
//         '3NF no transitive dependency',
//         'before & after tables',
//       ],
//     },
//   ],
// };

// // ── LOCAL AUTH (replace with Supabase for production) ─────────────
// function getUsers() {
//   try {
//     return JSON.parse(localStorage.getItem('sf_users') || '[]');
//   } catch {
//     return [];
//   }
// }
// function saveUsers(u) {
//   localStorage.setItem('sf_users', JSON.stringify(u));
// }
// function getSession() {
//   try {
//     return JSON.parse(localStorage.getItem('sf_session') || 'null');
//   } catch {
//     return null;
//   }
// }
// function saveSession(s) {
//   localStorage.setItem('sf_session', s ? JSON.stringify(s) : 'null');
// }
// function getUserData(uid) {
//   try {
//     return JSON.parse(localStorage.getItem(`sf_data_${uid}`) || '{}');
//   } catch {
//     return {};
//   }
// }
// function saveUserData(uid, d) {
//   localStorage.setItem(`sf_data_${uid}`, JSON.stringify(d));
// }
// function getApiKey() {
//   return localStorage.getItem('sf_api_key') || CONFIG.ANTHROPIC_KEY || '';
// }
// function saveApiKey(k) {
//   localStorage.setItem('sf_api_key', k);
// }

// // ── AI CALL ────────────────────────────────────────────────────────
// async function callAI(messages, system, apiKey) {
//   const key = apiKey || getApiKey();
//   if (!key) throw new Error('NO_KEY');
//   const res = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-api-key': key,
//       'anthropic-version': '2023-06-01',
//     },
//     body: JSON.stringify({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 1000,
//       system,
//       messages,
//     }),
//   });
//   if (!res.ok) {
//     const e = await res.json().catch(() => ({}));
//     throw new Error(e?.error?.message || `API error ${res.status}`);
//   }
//   const d = await res.json();
//   return (
//     d.content
//       ?.filter((b) => b.type === 'text')
//       .map((b) => b.text)
//       .join('') || ''
//   );
// }

// // ── HELPERS ────────────────────────────────────────────────────────
// function useData(user) {
//   const uid = user?.id;
//   const [data, _setData] = useState(() => (uid ? getUserData(uid) : {}));
//   const setData = useCallback(
//     (d) => {
//       _setData(d);
//       if (uid) saveUserData(uid, d);
//     },
//     [uid]
//   );
//   useEffect(() => {
//     if (uid) _setData(getUserData(uid));
//   }, [uid]);
//   return [data, setData];
// }

// function todayKey() {
//   return new Date().toDateString();
// }
// function canUseAI(data, plan) {
//   if (plan === 'pro' || plan === 'admin') return true;
//   const used = data.aiUsage?.[todayKey()] || 0;
//   return used < CONFIG.FREE_AI_LIMIT;
// }
// function recordAIUse(data, setData) {
//   const today = todayKey();
//   const used = data.aiUsage?.[today] || 0;
//   setData({ ...data, aiUsage: { ...(data.aiUsage || {}), [today]: used + 1 } });
// }
// function aiUsedToday(data) {
//   return data.aiUsage?.[todayKey()] || 0;
// }

// // ── TINY UI ────────────────────────────────────────────────────────
// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
//   @keyframes spin{to{transform:rotate(360deg)}}
//   @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
//   @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
//   @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:200px 0}}
//   .fade{animation:fadeUp .28s ease forwards}
//   .pulse{animation:pulse 1.6s infinite}
//   *{box-sizing:border-box}
//   ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#ffffff18;border-radius:9px}
//   textarea,input,select,button{font-family:inherit}
//   button:active{transform:scale(.97)}
// `;

// function Spin({ size = 16 }) {
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         border: `2px solid #ffffff18`,
//         borderTop: `2px solid #00c9a7`,
//         borderRadius: '50%',
//         display: 'inline-block',
//         animation: 'spin .7s linear infinite',
//         flexShrink: 0,
//       }}
//     />
//   );
// }
// function Badge({ c = '#00c9a7', children, sm }) {
//   return (
//     <span
//       style={{
//         background: c + '22',
//         color: c,
//         border: `1px solid ${c}44`,
//         borderRadius: 6,
//         padding: sm ? '1px 7px' : '3px 10px',
//         fontSize: sm ? 9 : 11,
//         fontWeight: 700,
//         letterSpacing: 0.3,
//         whiteSpace: 'nowrap',
//       }}
//     >
//       {children}
//     </span>
//   );
// }
// function Bar({ v = 0, max = 1, c = '#00c9a7', h = 5 }) {
//   return (
//     <div
//       style={{
//         background: '#ffffff0a',
//         borderRadius: 99,
//         height: h,
//         overflow: 'hidden',
//       }}
//     >
//       <div
//         style={{
//           width: `${Math.min(100, Math.round((v / max) * 100))}%`,
//           height: '100%',
//           background: c,
//           borderRadius: 99,
//           transition: 'width .5s',
//         }}
//       />
//     </div>
//   );
// }
// function Btn({ children, onClick, c = '#00c9a7', disabled, full, sm, danger }) {
//   const col = danger ? '#ef4444' : c;
//   return (
//     <button
//       disabled={disabled}
//       onClick={onClick}
//       style={{
//         width: full ? '100%' : 'auto',
//         padding: sm ? '6px 14px' : '10px 22px',
//         background: disabled ? '#ffffff05' : col + '1e',
//         border: `1px solid ${disabled ? '#ffffff10' : col + '44'}`,
//         borderRadius: 9,
//         color: disabled ? '#ffffff22' : col,
//         cursor: disabled ? 'not-allowed' : 'pointer',
//         fontSize: sm ? 11 : 13,
//         fontWeight: 600,
//         letterSpacing: 0.4,
//         display: 'inline-flex',
//         alignItems: 'center',
//         gap: 8,
//         justifyContent: 'center',
//         transition: 'all .18s',
//         whiteSpace: 'nowrap',
//       }}
//     >
//       {children}
//     </button>
//   );
// }
// function Card({ children, onClick, style: s = {}, glow }) {
//   const base = {
//     background: '#ffffff06',
//     border: `1px solid ${glow ? glow + '44' : '#ffffff0d'}`,
//     borderRadius: 14,
//     padding: 20,
//     ...s,
//     cursor: onClick ? 'pointer' : 'default',
//     transition: 'all .18s',
//   };
//   return (
//     <div
//       style={base}
//       onMouseEnter={(e) => {
//         if (onClick) {
//           e.currentTarget.style.borderColor = glow ? glow + '88' : '#ffffff22';
//           e.currentTarget.style.transform = 'translateY(-2px)';
//         }
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.borderColor = glow ? glow + '44' : '#ffffff0d';
//         e.currentTarget.style.transform = '';
//       }}
//     >
//       {children}
//     </div>
//   );
// }
// function Input({ label, type = 'text', value, onChange, placeholder, hint }) {
//   return (
//     <div style={{ marginBottom: 16 }}>
//       {label && (
//         <div
//           style={{
//             fontSize: 10,
//             color: '#ffffff44',
//             letterSpacing: 2,
//             marginBottom: 7,
//           }}
//         >
//           {label}
//         </div>
//       )}
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         style={{
//           width: '100%',
//           background: '#ffffff08',
//           border: '1px solid #ffffff18',
//           borderRadius: 9,
//           padding: '11px 14px',
//           color: '#dde1f0',
//           fontSize: 13,
//           outline: 'none',
//         }}
//       />
//       {hint && (
//         <div style={{ fontSize: 11, color: '#ffffff33', marginTop: 5 }}>
//           {hint}
//         </div>
//       )}
//     </div>
//   );
// }
// function Divider({ label }) {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: 10,
//         margin: '18px 0',
//       }}
//     >
//       <div style={{ flex: 1, height: 1, background: '#ffffff0e' }} />
//       {label && (
//         <span style={{ fontSize: 10, color: '#ffffff33', letterSpacing: 2 }}>
//           {label}
//         </span>
//       )}
//       <div style={{ flex: 1, height: 1, background: '#ffffff0e' }} />
//     </div>
//   );
// }

// // Renders AI markdown-ish text nicely
// function AIText({ text }) {
//   if (!text) return null;
//   return (
//     <div style={{ fontSize: 13, lineHeight: 2, color: '#dde1f0' }}>
//       {text.split('\n').map((line, i) => {
//         if (!line.trim()) return <div key={i} style={{ height: 8 }} />;
//         const hl = line
//           .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#fff">$1</strong>')
//           .replace(
//             /`([^`]+)`/g,
//             '<code style="background:#ffffff12;padding:1px 7px;borderRadius:4px;fontFamily:monospace;fontSize:11px;color:#84cc16">$1</code>'
//           );
//         if (/^##+ /.test(line))
//           return (
//             <div
//               key={i}
//               style={{
//                 fontWeight: 600,
//                 fontSize: 14,
//                 color: '#fff',
//                 margin: '16px 0 7px',
//                 paddingBottom: 6,
//                 borderBottom: '1px solid #ffffff10',
//               }}
//               dangerouslySetInnerHTML={{ __html: hl.replace(/^#+\s*/, '') }}
//             />
//           );
//         if (/^[\*\-•] /.test(line))
//           return (
//             <div
//               key={i}
//               style={{
//                 display: 'flex',
//                 gap: 9,
//                 margin: '3px 0',
//                 paddingLeft: 4,
//               }}
//             >
//               <span style={{ color: '#00c9a7', flexShrink: 0, marginTop: 3 }}>
//                 ▸
//               </span>
//               <span
//                 dangerouslySetInnerHTML={{
//                   __html: hl.replace(/^[\*\-•] /, ''),
//                 }}
//               />
//             </div>
//           );
//         if (/^\d+\. /.test(line)) {
//           const n = line.match(/^(\d+)/)?.[1];
//           return (
//             <div key={i} style={{ display: 'flex', gap: 10, margin: '4px 0' }}>
//               <span
//                 style={{
//                   background: '#00c9a720',
//                   color: '#00c9a7',
//                   border: '1px solid #00c9a730',
//                   borderRadius: 5,
//                   width: 22,
//                   height: 22,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: 11,
//                   fontWeight: 700,
//                   flexShrink: 0,
//                 }}
//               >
//                 {n}
//               </span>
//               <span
//                 dangerouslySetInnerHTML={{ __html: hl.replace(/^\d+\. /, '') }}
//                 style={{ lineHeight: 1.75 }}
//               />
//             </div>
//           );
//         }
//         if (/^```/.test(line) || /^    /.test(line))
//           return (
//             <div
//               key={i}
//               style={{
//                 fontFamily: 'monospace',
//                 fontSize: 12,
//                 color: '#84cc16',
//                 background: '#0a0f1e',
//                 padding: '2px 10px',
//                 borderLeft: '2px solid #84cc1640',
//               }}
//               dangerouslySetInnerHTML={{
//                 __html: line.replace(/^```\w*/, '').replace(/^    /, ''),
//               }}
//             />
//           );
//         return (
//           <p
//             key={i}
//             style={{ margin: '2px 0', lineHeight: 1.9 }}
//             dangerouslySetInnerHTML={{ __html: hl }}
//           />
//         );
//       })}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  ROOT APP
// // ═══════════════════════════════════════════════════════════════════
// export default function App() {
//   const [user, setUser] = useState(() => getSession());
//   const [screen, setScreen] = useState('app'); // app | admin | settings
//   const [apiKey, setApiKey] = useState(getApiKey);
//   const [data, setData] = useData(user);

//   const logout = () => {
//     saveSession(null);
//     setUser(null);
//   };
//   const plan = user?.plan || 'free';

//   // save api key whenever it changes
//   useEffect(() => {
//     if (apiKey) saveApiKey(apiKey);
//   }, [apiKey]);

//   if (!user)
//     return (
//       <AuthScreen
//         onLogin={(u) => {
//           saveSession(u);
//           setUser(u);
//         }}
//       />
//     );

//   // Admin sees admin dashboard by default
//   if (plan === 'admin' && screen === 'admin')
//     return (
//       <AdminDashboard
//         user={user}
//         onBack={() => setScreen('app')}
//         onLogout={logout}
//       />
//     );

//   return (
//     <MainApp
//       user={user}
//       data={data}
//       setData={setData}
//       plan={plan}
//       apiKey={apiKey}
//       setApiKey={setApiKey}
//       onLogout={logout}
//       onAdmin={plan === 'admin' ? () => setScreen('admin') : null}
//     />
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  AUTH SCREEN
// // ═══════════════════════════════════════════════════════════════════
// function AuthScreen({ onLogin }) {
//   const [mode, setMode] = useState('login'); // login | register
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [pass, setPass] = useState('');
//   const [err, setErr] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handle = () => {
//     setErr('');
//     setLoading(true);
//     setTimeout(() => {
//       const users = getUsers();
//       if (mode === 'register') {
//         if (!name || !email || !pass) {
//           setErr('Fill all fields.');
//           setLoading(false);
//           return;
//         }
//         if (users.find((u) => u.email === email)) {
//           setErr('Email already registered.');
//           setLoading(false);
//           return;
//         }
//         const isOwner = email === CONFIG.OWNER_EMAIL;
//         const nu = {
//           id: `u_${Date.now()}`,
//           name,
//           email,
//           pass,
//           plan: isOwner ? 'admin' : 'free',
//           joined: Date.now(),
//           aiUsage: {},
//         };
//         saveUsers([...users, nu]);
//         onLogin(nu);
//       } else {
//         const u = users.find((u) => u.email === email && u.pass === pass);
//         if (!u) {
//           setErr('Wrong email or password.');
//           setLoading(false);
//           return;
//         }
//         onLogin(u);
//       }
//       setLoading(false);
//     }, 400);
//   };

//   const demoLogin = (plan) => {
//     const users = getUsers();
//     const demo = users.find((u) => u.plan === plan) || null;
//     if (demo) {
//       onLogin(demo);
//       return;
//     }
//     const nu = {
//       id: `demo_${plan}`,
//       name: plan === 'admin' ? 'Admin Owner' : 'Demo Student',
//       email: `demo_${plan}@sf.com`,
//       pass: 'demo',
//       plan,
//       joined: Date.now(),
//     };
//     saveUsers([...users, nu]);
//     onLogin(nu);
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "'IBM Plex Mono',monospace",
//         background: '#07070e',
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 20,
//       }}
//     >
//       <style>{css}</style>
//       <div style={{ width: '100%', maxWidth: 420 }}>
//         {/* Logo */}
//         <div style={{ textAlign: 'center', marginBottom: 36 }}>
//           <div
//             style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: 56,
//               height: 56,
//               borderRadius: 16,
//               background: 'linear-gradient(135deg,#00c9a7,#7c3aed)',
//               fontSize: 26,
//               marginBottom: 14,
//             }}
//           >
//             🎓
//           </div>
//           <div
//             style={{
//               fontSize: 22,
//               fontWeight: 600,
//               color: '#fff',
//               letterSpacing: 2,
//             }}
//           >
//             STUDYFORGE
//           </div>
//           <div
//             style={{
//               fontSize: 10,
//               color: '#ffffff33',
//               letterSpacing: 3,
//               marginTop: 4,
//             }}
//           >
//             MCA · ANNA UNIVERSITY · SEM 1
//           </div>
//         </div>

//         <Card style={{ padding: 28 }}>
//           {/* Tab */}
//           <div
//             style={{
//               display: 'flex',
//               background: '#ffffff08',
//               borderRadius: 9,
//               padding: 3,
//               marginBottom: 22,
//             }}
//           >
//             {['login', 'register'].map((m) => (
//               <button
//                 key={m}
//                 onClick={() => {
//                   setMode(m);
//                   setErr('');
//                 }}
//                 style={{
//                   flex: 1,
//                   padding: '8px',
//                   background: mode === m ? '#ffffff12' : 'transparent',
//                   border: 'none',
//                   borderRadius: 7,
//                   color: mode === m ? '#fff' : '#ffffff44',
//                   cursor: 'pointer',
//                   fontSize: 12,
//                   fontWeight: mode === m ? 600 : 400,
//                   letterSpacing: 0.5,
//                   transition: 'all .2s',
//                 }}
//               >
//                 {m === 'login' ? 'Sign In' : 'Create Account'}
//               </button>
//             ))}
//           </div>

//           {mode === 'register' && (
//             <Input
//               label="YOUR NAME"
//               value={name}
//               onChange={setName}
//               placeholder="e.g. Priya Rajan"
//             />
//           )}
//           <Input
//             label="EMAIL ADDRESS"
//             type="email"
//             value={email}
//             onChange={setEmail}
//             placeholder="your@email.com"
//           />
//           <Input
//             label="PASSWORD"
//             type="password"
//             value={pass}
//             onChange={setPass}
//             placeholder="••••••••"
//             hint={
//               mode === 'register'
//                 ? 'Use your email as your Student ID across devices'
//                 : undefined
//             }
//           />

//           {err && (
//             <div
//               style={{
//                 background: '#ef444412',
//                 border: '1px solid #ef444430',
//                 borderRadius: 8,
//                 padding: '10px 14px',
//                 fontSize: 12,
//                 color: '#f87171',
//                 marginBottom: 14,
//               }}
//             >
//               {err}
//             </div>
//           )}

//           <Btn full onClick={handle} disabled={loading} c="#00c9a7">
//             {loading ? (
//               <>
//                 <Spin /> Please wait...
//               </>
//             ) : mode === 'login' ? (
//               'Sign In →'
//             ) : (
//               'Create Free Account →'
//             )}
//           </Btn>

//           <Divider label="QUICK DEMO" />
//           <div
//             style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
//           >
//             <Btn sm full onClick={() => demoLogin('free')} c="#ffffff44">
//               👤 Free User
//             </Btn>
//             <Btn sm full onClick={() => demoLogin('admin')} c="#f59e0b">
//               ⚡ Admin View
//             </Btn>
//           </div>
//         </Card>

//         <div
//           style={{
//             marginTop: 18,
//             background: '#00c9a710',
//             border: '1px solid #00c9a720',
//             borderRadius: 10,
//             padding: 14,
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               color: '#00c9a7',
//               fontWeight: 600,
//               marginBottom: 6,
//             }}
//           >
//             FREE vs PRO
//           </div>
//           <div style={{ fontSize: 11, color: '#ffffff55', lineHeight: 1.8 }}>
//             🆓 Free: 5 AI explanations/day · 2 mock tests · All syllabus
//             <br />⚡ Pro ({CONFIG.PRO_PRICE_DISPLAY}/mo): Unlimited AI ·
//             Unlimited tests · Progress sync
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  MAIN APP SHELL
// // ═══════════════════════════════════════════════════════════════════
// function MainApp({
//   user,
//   data,
//   setData,
//   plan,
//   apiKey,
//   setApiKey,
//   onLogout,
//   onAdmin,
// }) {
//   const [tab, setTab] = useState('dashboard');
//   const [showSettings, setShowSettings] = useState(false);
//   const [showPaywall, setShowPaywall] = useState(false);

//   const planInfo = PLANS[plan] || PLANS.free;
//   const aiUsed = aiUsedToday(data);
//   const aiLeft =
//     plan === 'free' ? Math.max(0, CONFIG.FREE_AI_LIMIT - aiUsed) : 999;

//   const tryAI = (fn) => {
//     if (!canUseAI(data, plan)) {
//       setShowPaywall(true);
//       return;
//     }
//     if (!getApiKey()) {
//       setShowSettings(true);
//       return;
//     }
//     fn();
//   };

//   const NAV = [
//     { id: 'dashboard', icon: '◈', label: 'Dashboard' },
//     { id: 'learn', icon: '📖', label: 'Learn' },
//     { id: 'practice', icon: '✏️', label: 'Practice' },
//     { id: 'lab', icon: '⌨️', label: 'Lab' },
//     { id: 'test', icon: '⏱️', label: 'Mock Test' },
//   ];

//   return (
//     <div
//       style={{
//         fontFamily: "'IBM Plex Mono',monospace",
//         background: '#07070e',
//         minHeight: '100vh',
//         color: '#dde1f0',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <style>{css}</style>

//       {/* HEADER */}
//       <header
//         style={{
//           borderBottom: '1px solid #ffffff0d',
//           padding: '11px 20px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           background: '#09090f',
//           position: 'sticky',
//           top: 0,
//           zIndex: 99,
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
//           <div
//             style={{
//               background: 'linear-gradient(135deg,#00c9a7,#7c3aed)',
//               width: 33,
//               height: 33,
//               borderRadius: 9,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: 16,
//             }}
//           >
//             🎓
//           </div>
//           <div>
//             <div
//               style={{
//                 fontWeight: 600,
//                 fontSize: 13,
//                 letterSpacing: 2,
//                 color: '#fff',
//               }}
//             >
//               STUDYFORGE
//             </div>
//             <div style={{ fontSize: 9, color: '#ffffff33', letterSpacing: 2 }}>
//               MCA · SEM 1
//             </div>
//           </div>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           {plan === 'free' && (
//             <div style={{ fontSize: 11, color: '#f59e0b' }}>
//               ⚡ {aiLeft} AI left today
//             </div>
//           )}
//           <Badge c={planInfo.color}>{planInfo.badge}</Badge>
//           {onAdmin && (
//             <Btn sm onClick={onAdmin} c="#f59e0b">
//               Admin
//             </Btn>
//           )}
//           <Btn sm onClick={() => setShowSettings(true)} c="#ffffff44">
//             ⚙
//           </Btn>
//           <Btn sm onClick={onLogout} c="#ffffff44">
//             Out
//           </Btn>
//         </div>
//       </header>

//       {/* NAV */}
//       <nav
//         style={{
//           borderBottom: '1px solid #ffffff08',
//           padding: '0 16px',
//           display: 'flex',
//           gap: 2,
//           background: '#0a0a12',
//           overflowX: 'auto',
//         }}
//       >
//         {NAV.map((n) => (
//           <button
//             key={n.id}
//             onClick={() => setTab(n.id)}
//             style={{
//               background: 'transparent',
//               border: 'none',
//               color: tab === n.id ? '#00c9a7' : '#ffffff44',
//               cursor: 'pointer',
//               padding: '10px 15px',
//               fontSize: 11,
//               letterSpacing: 0.8,
//               fontWeight: tab === n.id ? 600 : 400,
//               borderBottom:
//                 tab === n.id ? '2px solid #00c9a7' : '2px solid transparent',
//               whiteSpace: 'nowrap',
//               transition: 'all .18s',
//             }}
//           >
//             {n.icon} {n.label}
//           </button>
//         ))}
//       </nav>

//       {/* BODY */}
//       <main
//         style={{
//           flex: 1,
//           padding: '22px 18px',
//           maxWidth: 1060,
//           margin: '0 auto',
//           width: '100%',
//         }}
//       >
//         {tab === 'dashboard' && (
//           <DashTab
//             user={user}
//             data={data}
//             plan={plan}
//             aiLeft={aiLeft}
//             onUpgrade={() => setShowPaywall(true)}
//             onAdmin={onAdmin}
//           />
//         )}
//         {tab === 'learn' && (
//           <LearnTab
//             data={data}
//             setData={setData}
//             plan={plan}
//             tryAI={tryAI}
//             recordAI={() => recordAIUse(data, setData)}
//           />
//         )}
//         {tab === 'practice' && (
//           <PracticeTab
//             data={data}
//             setData={setData}
//             plan={plan}
//             tryAI={tryAI}
//             recordAI={() => recordAIUse(data, setData)}
//           />
//         )}
//         {tab === 'lab' && (
//           <LabTab
//             plan={plan}
//             tryAI={tryAI}
//             recordAI={() => recordAIUse(data, setData)}
//           />
//         )}
//         {tab === 'test' && (
//           <TestTab
//             data={data}
//             setData={setData}
//             plan={plan}
//             tryAI={tryAI}
//             recordAI={() => recordAIUse(data, setData)}
//           />
//         )}
//       </main>

//       {showSettings && (
//         <SettingsModal
//           user={user}
//           apiKey={apiKey}
//           setApiKey={setApiKey}
//           plan={plan}
//           onClose={() => setShowSettings(false)}
//           onUpgrade={() => {
//             setShowSettings(false);
//             setShowPaywall(true);
//           }}
//         />
//       )}
//       {showPaywall && (
//         <PaywallModal
//           plan={plan}
//           user={user}
//           onClose={() => setShowPaywall(false)}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  SETTINGS MODAL
// // ═══════════════════════════════════════════════════════════════════
// function SettingsModal({ user, apiKey, setApiKey, plan, onClose, onUpgrade }) {
//   const [key, setKey] = useState(apiKey);
//   const save = () => {
//     setApiKey(key);
//     onClose();
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         inset: 0,
//         background: '#000000cc',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 200,
//         padding: 20,
//       }}
//     >
//       <Card style={{ width: '100%', maxWidth: 480, padding: 28 }}>
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             marginBottom: 22,
//           }}
//         >
//           <div style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>
//             ⚙ Settings
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: 'transparent',
//               border: 'none',
//               color: '#ffffff55',
//               cursor: 'pointer',
//               fontSize: 18,
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         <div
//           style={{
//             background: '#ffffff08',
//             borderRadius: 10,
//             padding: 14,
//             marginBottom: 20,
//           }}
//         >
//           <div style={{ fontSize: 11, color: '#ffffff44', marginBottom: 4 }}>
//             LOGGED IN AS
//           </div>
//           <div style={{ color: '#fff', fontWeight: 500 }}>{user.name}</div>
//           <div style={{ color: '#ffffff55', fontSize: 12 }}>{user.email}</div>
//           <div style={{ marginTop: 8 }}>
//             <Badge c={PLANS[plan]?.color || '#00c9a7'}>
//               {plan.toUpperCase()}
//             </Badge>
//           </div>
//         </div>

//         <div
//           style={{
//             marginBottom: 6,
//             fontSize: 10,
//             color: '#ffffff44',
//             letterSpacing: 2,
//           }}
//         >
//           YOUR ANTHROPIC API KEY
//         </div>
//         <div
//           style={{
//             fontSize: 11,
//             color: '#ffffff33',
//             marginBottom: 10,
//             lineHeight: 1.7,
//           }}
//         >
//           Get a free key at{' '}
//           <span style={{ color: '#00c9a7' }}>console.anthropic.com</span> → New
//           API Key.
//           <br />
//           Free credits = ~200+ AI explanations. Your key stays on your device
//           only.
//         </div>
//         <input
//           type="password"
//           value={key}
//           onChange={(e) => setKey(e.target.value)}
//           placeholder="sk-ant-api03-..."
//           style={{
//             width: '100%',
//             background: '#ffffff08',
//             border: '1px solid #ffffff18',
//             borderRadius: 9,
//             padding: '11px 14px',
//             color: '#dde1f0',
//             fontSize: 13,
//             outline: 'none',
//             marginBottom: 14,
//           }}
//         />

//         <div style={{ display: 'flex', gap: 10 }}>
//           <Btn full onClick={save} c="#00c9a7">
//             Save Key
//           </Btn>
//           {plan === 'free' && (
//             <Btn full onClick={onUpgrade} c="#7c3aed">
//               Upgrade to Pro
//             </Btn>
//           )}
//         </div>

//         <Divider label="HOW TO GET FREE API KEY" />
//         <div style={{ fontSize: 11, color: '#ffffff44', lineHeight: 1.9 }}>
//           1. Go to{' '}
//           <span style={{ color: '#00c9a7' }}>console.anthropic.com</span>
//           <br />
//           2. Sign up free
//           <br />
//           3. Click "API Keys" → "Create Key"
//           <br />
//           4. Copy and paste it above
//           <br />
//           5. Free $5 credit = ~300 AI calls 🎉
//         </div>
//       </Card>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  PAYWALL MODAL (Razorpay Integration)
// // ═══════════════════════════════════════════════════════════════════
// function PaywallModal({ plan, user, onClose }) {
//   const [loading, setLoading] = useState(false);
//   const [done, setDone] = useState(false);

//   const pay = () => {
//     setLoading(true);
//     // Load Razorpay script dynamically
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => {
//       const options = {
//         key: CONFIG.RAZORPAY_KEY,
//         amount: CONFIG.PRO_PRICE,
//         currency: 'INR',
//         name: 'StudyForge Pro',
//         description: 'Unlimited AI study for MCA Sem 1',
//         image: '',
//         prefill: { name: user.name, email: user.email },
//         theme: { color: '#00c9a7' },
//         handler: (response) => {
//           // ✅ Payment successful
//           // In production: verify payment on your backend, then update Supabase user.plan = "pro"
//           // For demo: update localStorage
//           const users = getUsers();
//           const updated = users.map((u) =>
//             u.id === user.id
//               ? {
//                   ...u,
//                   plan: 'pro',
//                   paidAt: Date.now(),
//                   razorpayId: response.razorpay_payment_id,
//                 }
//               : u
//           );
//           saveUsers(updated);
//           const sess = { ...user, plan: 'pro' };
//           saveSession(sess);
//           setDone(true);
//           setLoading(false);
//           setTimeout(() => window.location.reload(), 1500);
//         },
//         modal: { ondismiss: () => setLoading(false) },
//       };
//       new window.Razorpay(options).open();
//     };
//     script.onerror = () => {
//       setLoading(false);
//       alert('Could not load payment. Check internet.');
//     };
//     document.body.appendChild(script);
//   };

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         inset: 0,
//         background: '#000000dd',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 200,
//         padding: 20,
//       }}
//     >
//       <Card style={{ width: '100%', maxWidth: 460, padding: 30 }}>
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             marginBottom: 20,
//           }}
//         >
//           <div style={{ fontWeight: 600, fontSize: 16, color: '#fff' }}>
//             ⚡ Upgrade to Pro
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: 'transparent',
//               border: 'none',
//               color: '#ffffff44',
//               cursor: 'pointer',
//               fontSize: 18,
//             }}
//           >
//             ✕
//           </button>
//         </div>

//         {done ? (
//           <div style={{ textAlign: 'center', padding: 30 }}>
//             <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
//             <div style={{ color: '#00c9a7', fontWeight: 600, fontSize: 16 }}>
//               Payment Successful!
//             </div>
//             <div style={{ color: '#ffffff55', fontSize: 12, marginTop: 8 }}>
//               Refreshing your account...
//             </div>
//           </div>
//         ) : (
//           <>
//             <div
//               style={{
//                 display: 'grid',
//                 gridTemplateColumns: '1fr 1fr',
//                 gap: 12,
//                 marginBottom: 24,
//               }}
//             >
//               <Card style={{ padding: 16, borderColor: '#ffffff22' }}>
//                 <div
//                   style={{ fontSize: 12, color: '#ffffff44', marginBottom: 8 }}
//                 >
//                   🆓 FREE
//                 </div>
//                 <div style={{ fontSize: 22, fontWeight: 600, color: '#fff' }}>
//                   ₹0
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: '#ffffff44',
//                     marginTop: 10,
//                     lineHeight: 1.8,
//                   }}
//                 >
//                   5 AI explanations/day
//                   <br />2 mock tests/day
//                   <br />
//                   All 7 subjects
//                   <br />
//                   Progress saved locally
//                 </div>
//               </Card>
//               <Card
//                 style={{
//                   padding: 16,
//                   borderColor: '#00c9a788',
//                   background: '#00c9a710',
//                 }}
//               >
//                 <div
//                   style={{ fontSize: 12, color: '#00c9a7', marginBottom: 8 }}
//                 >
//                   ⚡ PRO
//                 </div>
//                 <div style={{ fontSize: 22, fontWeight: 600, color: '#fff' }}>
//                   ₹99
//                   <span style={{ fontSize: 12, color: '#ffffff55' }}>/mo</span>
//                 </div>
//                 <div
//                   style={{
//                     fontSize: 11,
//                     color: '#ffffff88',
//                     marginTop: 10,
//                     lineHeight: 1.8,
//                   }}
//                 >
//                   <strong style={{ color: '#00c9a7' }}>Unlimited</strong> AI
//                   calls
//                   <br />
//                   <strong style={{ color: '#00c9a7' }}>Unlimited</strong> mock
//                   tests
//                   <br />
//                   Hint system
//                   <br />
//                   Progress synced
//                   <br />
//                   Priority support
//                 </div>
//               </Card>
//             </div>

//             <Btn full onClick={pay} disabled={loading} c="#00c9a7">
//               {loading ? (
//                 <>
//                   <Spin /> Opening payment...
//                 </>
//               ) : (
//                 'Pay ₹99 via UPI / Card / Net Banking'
//               )}
//             </Btn>

//             <div
//               style={{
//                 marginTop: 14,
//                 fontSize: 11,
//                 color: '#ffffff33',
//                 textAlign: 'center',
//                 lineHeight: 1.7,
//               }}
//             >
//               Powered by Razorpay · 100% secure · Cancel anytime
//               <br />
//               UPI · Debit/Credit Card · Net Banking · Wallets
//             </div>

//             <Divider label="SHARE WITH FRIENDS" />
//             <div style={{ fontSize: 11, color: '#ffffff44', lineHeight: 1.8 }}>
//               📢 Share this app with your MCA batch!
//               <br />
//               Each friend can sign up free and add their own Anthropic API key.
//               <br />
//               No cost to share. Help your friends study smarter 🙌
//             </div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  ADMIN DASHBOARD
// // ═══════════════════════════════════════════════════════════════════
// function AdminDashboard({ user, onBack, onLogout }) {
//   const users = getUsers();
//   const proUsers = users.filter((u) => u.plan === 'pro');
//   const freeUsers = users.filter((u) => u.plan === 'free');
//   const revenue = proUsers.length * 99;

//   // Aggregate AI usage across all users
//   const totalAICalls = users.reduce((s, u) => {
//     const d = getUserData(u.id);
//     const calls = Object.values(d.aiUsage || {}).reduce((a, b) => a + b, 0);
//     return s + calls;
//   }, 0);

//   return (
//     <div
//       style={{
//         fontFamily: "'IBM Plex Mono',monospace",
//         background: '#07070e',
//         minHeight: '100vh',
//         color: '#dde1f0',
//       }}
//     >
//       <style>{css}</style>
//       <header
//         style={{
//           borderBottom: '1px solid #ffffff0d',
//           padding: '11px 20px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           background: '#09090f',
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//           <Btn sm onClick={onBack} c="#ffffff44">
//             ← App
//           </Btn>
//           <div
//             style={{
//               fontWeight: 600,
//               fontSize: 14,
//               color: '#f59e0b',
//               letterSpacing: 2,
//             }}
//           >
//             ⚡ ADMIN DASHBOARD
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 10 }}>
//           <Badge c="#f59e0b">OWNER</Badge>
//           <Btn sm onClick={onLogout} c="#ffffff44">
//             Logout
//           </Btn>
//         </div>
//       </header>

//       <main style={{ padding: '24px 20px', maxWidth: 1060, margin: '0 auto' }}>
//         <div className="fade">
//           <h2
//             style={{
//               fontSize: 18,
//               fontWeight: 600,
//               color: '#fff',
//               marginBottom: 20,
//             }}
//           >
//             Business Overview
//           </h2>

//           {/* Revenue stats */}
//           <div
//             style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(4,1fr)',
//               gap: 14,
//               marginBottom: 28,
//             }}
//           >
//             {[
//               {
//                 l: 'Monthly Revenue',
//                 v: `₹${revenue}`,
//                 c: '#00c9a7',
//                 s: 'from pro users',
//               },
//               {
//                 l: 'Total Users',
//                 v: users.length,
//                 c: '#7c3aed',
//                 s: `${proUsers.length} pro · ${freeUsers.length} free`,
//               },
//               {
//                 l: 'AI Calls Used',
//                 v: totalAICalls,
//                 c: '#f59e0b',
//                 s: 'across all users',
//               },
//               {
//                 l: 'API Cost Est.',
//                 v: `₹${Math.round(totalAICalls * 0.07)}`,
//                 c: '#ec4899',
//                 s: '~₹0.07/call',
//               },
//             ].map((s) => (
//               <Card key={s.l} style={{ padding: 18 }}>
//                 <div
//                   style={{
//                     fontSize: 10,
//                     color: '#ffffff33',
//                     letterSpacing: 2,
//                     marginBottom: 8,
//                   }}
//                 >
//                   {s.l.toUpperCase()}
//                 </div>
//                 <div style={{ fontSize: 26, fontWeight: 600, color: s.c }}>
//                   {s.v}
//                 </div>
//                 <div style={{ fontSize: 11, color: '#ffffff33', marginTop: 5 }}>
//                   {s.s}
//                 </div>
//               </Card>
//             ))}
//           </div>

//           {/* Profit calc */}
//           <Card
//             style={{
//               marginBottom: 24,
//               background: '#00c9a710',
//               borderColor: '#00c9a730',
//             }}
//           >
//             <div
//               style={{
//                 fontWeight: 600,
//                 color: '#00c9a7',
//                 marginBottom: 12,
//                 fontSize: 13,
//               }}
//             >
//               💰 PROFIT ESTIMATE (this month)
//             </div>
//             <div
//               style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(3,1fr)',
//                 gap: 16,
//               }}
//             >
//               <div>
//                 <div style={{ fontSize: 11, color: '#ffffff44' }}>Revenue</div>
//                 <div style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
//                   ₹{revenue}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 11, color: '#ffffff44' }}>
//                   API Cost (~15%)
//                 </div>
//                 <div
//                   style={{ fontSize: 20, fontWeight: 600, color: '#ef4444' }}
//                 >
//                   -₹{Math.round(revenue * 0.15)}
//                 </div>
//               </div>
//               <div>
//                 <div style={{ fontSize: 11, color: '#ffffff44' }}>
//                   Net Profit
//                 </div>
//                 <div
//                   style={{ fontSize: 20, fontWeight: 600, color: '#00c9a7' }}
//                 >
//                   ₹{Math.round(revenue * 0.85)}
//                 </div>
//               </div>
//             </div>
//             <div style={{ marginTop: 12, fontSize: 11, color: '#ffffff44' }}>
//               With 50 pro users → ₹{Math.round(50 * 99 * 0.85)}/month · 200
//               users → ₹{Math.round(200 * 99 * 0.85)}/month
//             </div>
//           </Card>

//           {/* Users table */}
//           <div
//             style={{
//               fontWeight: 600,
//               color: '#fff',
//               marginBottom: 14,
//               fontSize: 14,
//             }}
//           >
//             All Users ({users.length})
//           </div>
//           <Card style={{ padding: 0, overflow: 'hidden' }}>
//             <div style={{ overflowX: 'auto' }}>
//               <table
//                 style={{
//                   width: '100%',
//                   borderCollapse: 'collapse',
//                   fontSize: 12,
//                 }}
//               >
//                 <thead>
//                   <tr style={{ borderBottom: '1px solid #ffffff0d' }}>
//                     {['Name', 'Email', 'Plan', 'Joined', 'AI Calls'].map(
//                       (h) => (
//                         <th
//                           key={h}
//                           style={{
//                             padding: '12px 16px',
//                             textAlign: 'left',
//                             color: '#ffffff44',
//                             letterSpacing: 1,
//                             fontSize: 10,
//                             fontWeight: 700,
//                           }}
//                         >
//                           {h.toUpperCase()}
//                         </th>
//                       )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((u) => {
//                     const d = getUserData(u.id);
//                     const calls = Object.values(d.aiUsage || {}).reduce(
//                       (a, b) => a + b,
//                       0
//                     );
//                     const planColor = PLANS[u.plan]?.color || '#ffffff55';
//                     return (
//                       <tr
//                         key={u.id}
//                         style={{ borderBottom: '1px solid #ffffff06' }}
//                         onMouseEnter={(e) =>
//                           (e.currentTarget.style.background = '#ffffff05')
//                         }
//                         onMouseLeave={(e) =>
//                           (e.currentTarget.style.background = 'transparent')
//                         }
//                       >
//                         <td
//                           style={{
//                             padding: '11px 16px',
//                             color: '#fff',
//                             fontWeight: 500,
//                           }}
//                         >
//                           {u.name}
//                         </td>
//                         <td
//                           style={{ padding: '11px 16px', color: '#ffffff55' }}
//                         >
//                           {u.email}
//                         </td>
//                         <td style={{ padding: '11px 16px' }}>
//                           <Badge c={planColor} sm>
//                             {u.plan.toUpperCase()}
//                           </Badge>
//                         </td>
//                         <td
//                           style={{ padding: '11px 16px', color: '#ffffff44' }}
//                         >
//                           {u.joined
//                             ? new Date(u.joined).toLocaleDateString()
//                             : '-'}
//                         </td>
//                         <td
//                           style={{
//                             padding: '11px 16px',
//                             color: '#00c9a7',
//                             fontWeight: 500,
//                           }}
//                         >
//                           {calls}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   {users.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={5}
//                         style={{
//                           padding: 30,
//                           textAlign: 'center',
//                           color: '#ffffff33',
//                         }}
//                       >
//                         No users yet. Share your app link!
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </Card>

//           {/* Tips */}
//           <div
//             style={{
//               marginTop: 24,
//               display: 'grid',
//               gridTemplateColumns: '1fr 1fr',
//               gap: 14,
//             }}
//           >
//             <Card style={{ background: '#7c3aed10', borderColor: '#7c3aed30' }}>
//               <div
//                 style={{
//                   fontWeight: 600,
//                   color: '#a78bfa',
//                   marginBottom: 10,
//                   fontSize: 12,
//                 }}
//               >
//                 🚀 GROW YOUR USER BASE
//               </div>
//               <div
//                 style={{ fontSize: 11, color: '#ffffff55', lineHeight: 1.9 }}
//               >
//                 • Share in MCA WhatsApp groups
//                 <br />
//                 • Post in Anna University Facebook groups
//                 <br />
//                 • Share with coaching centres (batch deals)
//                 <br />
//                 • Offer 1 month free to first 20 students
//                 <br />• Add more universities to attract more users
//               </div>
//             </Card>
//             <Card style={{ background: '#f59e0b10', borderColor: '#f59e0b30' }}>
//               <div
//                 style={{
//                   fontWeight: 600,
//                   color: '#fbbf24',
//                   marginBottom: 10,
//                   fontSize: 12,
//                 }}
//               >
//                 ⚙️ DEPLOYMENT STEPS
//               </div>
//               <div
//                 style={{ fontSize: 11, color: '#ffffff55', lineHeight: 1.9 }}
//               >
//                 1. Create Supabase project (free)
//                 <br />
//                 2. Replace localStorage auth with Supabase
//                 <br />
//                 3. Deploy to Vercel (free, one click)
//                 <br />
//                 4. Add Razorpay live keys
//                 <br />
//                 5. Add your domain → share the link!
//               </div>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  DASHBOARD TAB
// // ═══════════════════════════════════════════════════════════════════
// function DashTab({ user, data, plan, aiLeft, onUpgrade, onAdmin }) {
//   const progress = data.progress || {};
//   const scores = data.scores || [];
//   const streak = data.streak || { count: 1 };
//   const total = SUBJECTS.reduce(
//     (s, sub) => s + sub.units.reduce((u, un) => u + un.topics.length, 0),
//     0
//   );
//   const done = Object.values(progress).filter((p) => p.completed).length;
//   const avg = scores.length
//     ? Math.round(
//         scores.reduce((s, r) => s + (r.got / r.max) * 100, 0) / scores.length
//       )
//     : 0;

//   return (
//     <div className="fade">
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'flex-start',
//           marginBottom: 24,
//         }}
//       >
//         <div>
//           <h2
//             style={{ fontSize: 19, fontWeight: 600, color: '#fff', margin: 0 }}
//           >
//             Welcome back, {user.name.split(' ')[0]}! 👋
//           </h2>
//           <p style={{ color: '#ffffff44', fontSize: 12, marginTop: 4 }}>
//             Anna University MCA · Semester 1 · {SUBJECTS.length} Subjects
//           </p>
//         </div>
//         {plan === 'free' && (
//           <Btn onClick={onUpgrade} c="#00c9a7">
//             ⚡ Upgrade to Pro
//           </Btn>
//         )}
//       </div>

//       <div
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(4,1fr)',
//           gap: 13,
//           marginBottom: 24,
//         }}
//       >
//         {[
//           {
//             l: 'Topics Done',
//             v: `${done}/${total}`,
//             c: '#00c9a7',
//             sub: `${Math.round((done / total) * 100) || 0}% complete`,
//           },
//           {
//             l: 'Avg Score',
//             v: `${avg}%`,
//             c: '#7c3aed',
//             sub: scores.length
//               ? `${scores.length} attempts`
//               : 'Start practicing!',
//           },
//           {
//             l: 'Day Streak',
//             v: `${streak.count}🔥`,
//             c: '#f59e0b',
//             sub: 'Keep it up!',
//           },
//           plan === 'free'
//             ? {
//                 l: 'AI Left Today',
//                 v: aiLeft,
//                 c: aiLeft > 2 ? '#00c9a7' : '#ef4444',
//                 sub: `of ${CONFIG.FREE_AI_LIMIT} free/day`,
//               }
//             : { l: 'Plan', v: 'PRO ⚡', c: '#00c9a7', sub: 'Unlimited access' },
//         ].map((s) => (
//           <Card key={s.l} style={{ padding: 16 }}>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: '#ffffff33',
//                 letterSpacing: 2,
//                 marginBottom: 8,
//               }}
//             >
//               {s.l.toUpperCase()}
//             </div>
//             <div style={{ fontSize: 24, fontWeight: 600, color: s.c }}>
//               {s.v}
//             </div>
//             <div style={{ fontSize: 11, color: '#ffffff33', marginTop: 5 }}>
//               {s.sub}
//             </div>
//           </Card>
//         ))}
//       </div>

//       {plan === 'free' && (
//         <div
//           style={{
//             background: 'linear-gradient(135deg,#00c9a710,#7c3aed10)',
//             border: '1px solid #00c9a730',
//             borderRadius: 14,
//             padding: 18,
//             marginBottom: 22,
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: 12,
//           }}
//         >
//           <div>
//             <div style={{ fontWeight: 600, color: '#00c9a7', fontSize: 13 }}>
//               🚀 Get Unlimited Access
//             </div>
//             <div style={{ fontSize: 12, color: '#ffffff55', marginTop: 4 }}>
//               Unlock unlimited AI explanations, mock tests, and hints for just{' '}
//               {CONFIG.PRO_PRICE_DISPLAY}/month
//             </div>
//           </div>
//           <Btn onClick={onUpgrade} c="#00c9a7">
//             Upgrade Now →
//           </Btn>
//         </div>
//       )}

//       <div
//         style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(2,1fr)',
//           gap: 13,
//         }}
//       >
//         {SUBJECTS.map((sub) => {
//           const ts = sub.units.flatMap((u) => u.topics);
//           const d = ts.filter((t) => progress[t.id]?.completed).length;
//           return (
//             <Card key={sub.id} glow={sub.color} style={{ padding: 18 }}>
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start',
//                   marginBottom: 12,
//                 }}
//               >
//                 <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
//                   <span style={{ fontSize: 22 }}>{sub.icon}</span>
//                   <div>
//                     <div
//                       style={{ fontWeight: 500, fontSize: 13, color: '#fff' }}
//                     >
//                       {sub.title}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 10,
//                         color: sub.color,
//                         letterSpacing: 1,
//                       }}
//                     >
//                       {sub.code}
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ textAlign: 'right' }}>
//                   <div
//                     style={{ fontSize: 20, fontWeight: 600, color: sub.color }}
//                   >
//                     {d}/{ts.length}
//                   </div>
//                   <div style={{ fontSize: 10, color: '#ffffff33' }}>topics</div>
//                 </div>
//               </div>
//               <Bar v={d} max={ts.length} c={sub.color} />
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  LEARN TAB
// // ═══════════════════════════════════════════════════════════════════
// function LearnTab({ data, setData, plan, tryAI, recordAI }) {
//   const [sub, setSub] = useState(null);
//   const [topic, setTopic] = useState(null);
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState('');
//   const [mode, setMode] = useState('explain');
//   const progress = data.progress || {};

//   const markDone = (id) => {
//     const p = {
//       ...(data.progress || {}),
//       [id]: { completed: true, at: Date.now() },
//     };
//     setData({ ...data, progress: p });
//   };

//   const load = (t, s, m = 'explain') => {
//     tryAI(async () => {
//       setLoading(true);
//       setErr('');
//       setContent('');
//       const SYSTEM = `You are a super friendly MCA tutor for a student who is a complete beginner. IMPORTANT RULES:
// - Use very simple, clear English. Avoid difficult words.
// - If you MUST use a technical word, immediately explain it in simple brackets like: Queue (Queue = a line of people waiting at a bus stop)
// - ALWAYS give TWO separate examples: 1) REAL LIFE EXAMPLE (something from daily life — food, phone, college, shopping) 2) REAL-TIME COMPUTER EXAMPLE (how a real software system uses this right now)
// - Never just define something. Always show WHY it matters and HOW it actually works.
// - Be warm and encouraging like a helpful senior friend`;
//       const prompts = {
//         explain: `Teach me "${t.title}" from "${s.title}" (MCA Anna University Sem 1).

// Use EXACTLY this structure:

// ## 🤔 WHAT IS IT?
// [Simple 2-3 sentence definition. Like explaining to a school friend.]

// ## 🏠 REAL LIFE EXAMPLE
// [A story from daily life — food, college, phone, shopping. Make it very relatable and fun!]

// ## 💻 REAL-TIME COMPUTER EXAMPLE
// [How this concept is used in a real software/app RIGHT NOW. Be specific — name the software.]

// ## 🔢 HOW IT WORKS — STEP BY STEP
// [Break it down into numbered steps. Simple language. Use ASCII diagram if helpful.]

// ## ❓ WHY DO WE NEED IT?
// [What problem does it solve? What would go wrong without it?]

// ## 🎯 KEY EXAM POINTS (must write in exam!)
// [5-7 bullet points that examiners look for]

// ## ⚡ QUICK REVISION CARD
// [3-4 lines only. Read this 5 minutes before exam.]`,

//         exam: `Give me exam-writing guide for "${t.title}" from "${s.title}".

// ## 📋 WHAT QUESTIONS COME?
// [Types of questions and mark patterns]

// ## ✅ WHAT TO WRITE FOR EACH MARK
// **2 marks:** [what to write — exact points]
// **5 marks:** [structure + points to cover]
// **10 marks:** [full structure + all points]
// **13 marks:** [everything + extra details]

// ## 📝 SAMPLE ANSWER SKELETON (5 marks)
// [Show the skeleton/structure of a good answer]

// ## ⚠️ COMMON MISTAKES
// [What students write wrong — and how to avoid]`,

//         glossary: `Create a simple word dictionary for "${t.title}" from "${s.title}".

// For each technical term, write:
// **[TERM]** = [One sentence simple explanation]
// 📌 Example: [tiny real-life example in one line]

// List 8-10 most important terms. Very simple language only.`,
//       };

//       try {
//         const res = await callAI(
//           [{ role: 'user', content: prompts[m] }],
//           SYSTEM
//         );
//         setContent(res);
//         recordAI();
//       } catch (e) {
//         if (e.message === 'NO_KEY')
//           setErr(
//             "No API key set. Go to ⚙ Settings → add your Anthropic API key (it's free to get!)"
//           );
//         else
//           setErr(
//             `Error: ${e.message}. Check your API key in Settings and try again.`
//           );
//       }
//       setLoading(false);
//     });
//   };

//   if (!sub)
//     return (
//       <div className="fade">
//         <h2
//           style={{
//             fontSize: 17,
//             fontWeight: 600,
//             color: '#fff',
//             marginBottom: 4,
//           }}
//         >
//           Choose a Subject
//         </h2>
//         <p style={{ color: '#ffffff44', fontSize: 12, marginBottom: 22 }}>
//           AI explains every topic with real-life + computer examples 🙂
//         </p>
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(2,1fr)',
//             gap: 13,
//           }}
//         >
//           {SUBJECTS.map((s) => {
//             const ts = s.units.flatMap((u) => u.topics);
//             const d = ts.filter((t) => progress[t.id]?.completed).length;
//             return (
//               <Card
//                 key={s.id}
//                 onClick={() => setSub(s)}
//                 glow={s.color}
//                 style={{ cursor: 'pointer', padding: 22 }}
//               >
//                 <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
//                 <div style={{ fontWeight: 500, fontSize: 14, color: '#fff' }}>
//                   {s.title}
//                 </div>
//                 <div style={{ fontSize: 11, color: s.color, marginBottom: 14 }}>
//                   {s.code} · {s.units.length} Units · {ts.length} Topics
//                 </div>
//                 <Bar v={d} max={ts.length} c={s.color} />
//                 <div style={{ fontSize: 10, color: '#ffffff33', marginTop: 6 }}>
//                   {d}/{ts.length} completed
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     );

//   if (!topic)
//     return (
//       <div className="fade">
//         <div
//           style={{
//             display: 'flex',
//             gap: 9,
//             alignItems: 'center',
//             marginBottom: 22,
//           }}
//         >
//           <Btn sm onClick={() => setSub(null)} c="#ffffff44">
//             ← Back
//           </Btn>
//           <span style={{ fontSize: 20 }}>{sub.icon}</span>
//           <div>
//             <div style={{ fontWeight: 600, color: '#fff', fontSize: 15 }}>
//               {sub.title}
//             </div>
//             <div style={{ fontSize: 10, color: sub.color, letterSpacing: 1 }}>
//               {sub.code}
//             </div>
//           </div>
//         </div>
//         {sub.units.map((u) => (
//           <div key={u.id} style={{ marginBottom: 20 }}>
//             <div
//               style={{
//                 fontSize: 10,
//                 letterSpacing: 2.5,
//                 color: sub.color,
//                 fontWeight: 700,
//                 marginBottom: 9,
//                 paddingBottom: 7,
//                 borderBottom: `1px solid ${sub.color}22`,
//               }}
//             >
//               UNIT {u.unit} — {u.title.toUpperCase()}
//             </div>
//             {u.topics.map((t) => (
//               <div
//                 key={t.id}
//                 onClick={() => {
//                   setTopic({ ...t, subject: sub });
//                   setContent('');
//                   setMode('explain');
//                 }}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '11px 13px',
//                   borderRadius: 10,
//                   cursor: 'pointer',
//                   marginBottom: 3,
//                   transition: 'all .15s',
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.background = '#ffffff08')
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.background = 'transparent')
//                 }
//               >
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <div
//                     style={{
//                       width: 18,
//                       height: 18,
//                       borderRadius: 5,
//                       background: progress[t.id]?.completed
//                         ? sub.color + '33'
//                         : '#ffffff08',
//                       border: `1px solid ${
//                         progress[t.id]?.completed ? sub.color : '#ffffff20'
//                       }`,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontSize: 10,
//                       color: sub.color,
//                     }}
//                   >
//                     {progress[t.id]?.completed ? '✓' : ''}
//                   </div>
//                   <span
//                     style={{
//                       fontSize: 13,
//                       color: progress[t.id]?.completed
//                         ? '#ffffff66'
//                         : '#dde1f0',
//                     }}
//                   >
//                     {t.title}
//                   </span>
//                 </div>
//                 <div style={{ display: 'flex', gap: 5 }}>
//                   {t.marks.map((m) => (
//                     <Badge key={m} c={sub.color} sm>
//                       {m}M
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     );

//   const sub2 = topic.subject;
//   return (
//     <div className="fade">
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: 8,
//           marginBottom: 18,
//           flexWrap: 'wrap',
//         }}
//       >
//         <Btn sm onClick={() => setTopic(null)} c="#ffffff44">
//           ← Topics
//         </Btn>
//         <span style={{ fontWeight: 600, color: '#fff', fontSize: 14, flex: 1 }}>
//           {topic.title}
//         </span>
//         {progress[topic.id]?.completed ? (
//           <Badge c={sub2.color}>✓ Done</Badge>
//         ) : (
//           <Btn sm onClick={() => markDone(topic.id)} c="#00c9a7">
//             ✓ Mark Done
//           </Btn>
//         )}
//       </div>

//       <div
//         style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}
//       >
//         {[
//           ['explain', '📖 Full Explain'],
//           ['exam', '🎯 Exam Tips'],
//           ['glossary', '📚 Word Guide'],
//         ].map(([m, l]) => (
//           <button
//             key={m}
//             onClick={() => {
//               setMode(m);
//               if (mode !== m || !content) load(topic, sub2, m);
//             }}
//             style={{
//               background: mode === m ? '#ffffff12' : 'transparent',
//               border: `1px solid ${mode === m ? '#ffffff22' : 'transparent'}`,
//               color: mode === m ? '#fff' : '#ffffff44',
//               cursor: 'pointer',
//               padding: '8px 16px',
//               borderRadius: 8,
//               fontSize: 11,
//               transition: 'all .18s',
//             }}
//           >
//             {l}
//           </button>
//         ))}
//         {content && (
//           <Btn sm onClick={() => load(topic, sub2, mode)} c="#ffffff44">
//             ↺ Reload
//           </Btn>
//         )}
//       </div>

//       <div
//         style={{
//           background: '#ffffff05',
//           border: '1px solid #ffffff0d',
//           borderRadius: 14,
//           padding: 22,
//           minHeight: 260,
//         }}
//       >
//         {loading ? (
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: 14,
//               padding: 50,
//               color: '#ffffff33',
//             }}
//           >
//             <Spin size={28} />
//             <div className="pulse" style={{ fontSize: 12 }}>
//               AI is writing your explanation...
//             </div>
//             <div style={{ fontSize: 11, color: '#ffffff22' }}>
//               Takes 5–15 seconds. Please wait 🙏
//             </div>
//           </div>
//         ) : err ? (
//           <div
//             style={{
//               background: '#ef444412',
//               border: '1px solid #ef444430',
//               borderRadius: 10,
//               padding: 18,
//             }}
//           >
//             <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>
//               ⚠ Could Not Load
//             </div>
//             <div style={{ fontSize: 12, color: '#f87171', lineHeight: 1.7 }}>
//               {err}
//             </div>
//             <div style={{ marginTop: 12 }}>
//               <Btn sm onClick={() => load(topic, sub2, mode)} c="#ef4444">
//                 Try Again
//               </Btn>
//             </div>
//           </div>
//         ) : content ? (
//           <AIText text={content} />
//         ) : (
//           <div style={{ textAlign: 'center', padding: 40 }}>
//             <div style={{ fontSize: 36, marginBottom: 14 }}>📖</div>
//             <div style={{ color: '#ffffff44', fontSize: 13, marginBottom: 18 }}>
//               Click below to load your AI explanation
//             </div>
//             <Btn onClick={() => load(topic, sub2, mode)} c="#00c9a7">
//               Load Explanation for "{topic.title}"
//             </Btn>
//             {plan === 'free' && (
//               <div style={{ fontSize: 11, color: '#ffffff33', marginTop: 10 }}>
//                 {aiUsedToday(data)}/{CONFIG.FREE_AI_LIMIT} AI calls used today
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  PRACTICE TAB
// // ═══════════════════════════════════════════════════════════════════
// function PracticeTab({ data, setData, plan, tryAI, recordAI }) {
//   const [sub, setSub] = useState(null);
//   const [topic, setTopic] = useState(null);
//   const [q, setQ] = useState(null);
//   const [ans, setAns] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState('');
//   const [hint, setHint] = useState('');
//   const [hintLoad, setHintLoad] = useState(false);

//   const qs = topic ? QB[topic.id] || [] : [];

//   const getHint = () =>
//     tryAI(async () => {
//       setHintLoad(true);
//       setHint('');
//       try {
//         const r = await callAI(
//           [
//             {
//               role: 'user',
//               content: `Give a 3-4 line hint (simple English, no big words) for: "${q.question}". Just a nudge — don't give the full answer.`,
//             },
//           ],
//           'You are a helpful tutor. Simple hints only.'
//         );
//         setHint(r);
//         recordAI();
//       } catch (e) {
//         setHint('Could not load hint. Check settings.');
//       }
//       setHintLoad(false);
//     });

//   const evaluate = () =>
//     tryAI(async () => {
//       if (!ans.trim()) return;
//       setLoading(true);
//       setResult(null);
//       setErr('');
//       const SYSTEM = `You are an Anna University exam evaluator. Use simple English. Be kind and specific. No big words.`;
//       const prompt = `Evaluate this ${q.marks}-mark answer for MCA exam.

// QUESTION: ${q.question}
// STUDENT'S ANSWER: ${ans}
// KEY POINTS EXPECTED: ${q.kp.map((p, i) => `${i + 1}. ${p}`).join('\n')}

// Reply in this EXACT format:

// MARKS_AWARDED: [number]/${q.marks}

// ✅ WHAT YOU GOT RIGHT:
// - [point]

// ❌ WHAT YOU MISSED:
// - [missing concept in simple words]

// 💡 HOW TO IMPROVE:
// - [simple suggestion]

// 📝 GRADE: [A/B/C/D]

// 🔁 PERFECT ANSWER SHOULD HAVE:
// [2-3 lines of what a perfect answer includes]`;
//       try {
//         const r = await callAI([{ role: 'user', content: prompt }], SYSTEM);
//         const m = r.match(/MARKS_AWARDED:\s*(\d+)/);
//         const got = m ? Math.min(parseInt(m[1]), q.marks) : 0;
//         setResult({ text: r, got });
//         const sc = [
//           ...(data.scores || []),
//           { id: topic.id, got, max: q.marks, date: Date.now() },
//         ];
//         setData({ ...data, scores: sc });
//         recordAI();
//       } catch (e) {
//         if (e.message === 'NO_KEY') setErr('No API key. Go to ⚙ Settings.');
//         else setErr('Evaluation failed. Check connection.');
//       }
//       setLoading(false);
//     });

//   if (!sub)
//     return (
//       <div className="fade">
//         <h2
//           style={{
//             fontSize: 17,
//             fontWeight: 600,
//             color: '#fff',
//             marginBottom: 4,
//           }}
//         >
//           Practice Questions
//         </h2>
//         <p style={{ color: '#ffffff44', fontSize: 12, marginBottom: 22 }}>
//           Exam-style 2/5/10/13 mark questions with AI evaluation + hints 💪
//         </p>
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(2,1fr)',
//             gap: 13,
//           }}
//         >
//           {SUBJECTS.map((s) => {
//             const n = s.units
//               .flatMap((u) => u.topics)
//               .filter((t) => QB[t.id]).length;
//             return (
//               <Card
//                 key={s.id}
//                 onClick={() => setSub(s)}
//                 glow={s.color}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
//                 <div style={{ fontWeight: 500, fontSize: 13, color: '#fff' }}>
//                   {s.title}
//                 </div>
//                 <div style={{ fontSize: 11, color: s.color, marginTop: 4 }}>
//                   {s.code} · {n} question set{n !== 1 ? 's' : ''} available
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     );

//   if (!topic)
//     return (
//       <div className="fade">
//         <div
//           style={{
//             display: 'flex',
//             gap: 9,
//             alignItems: 'center',
//             marginBottom: 20,
//           }}
//         >
//           <Btn sm onClick={() => setSub(null)} c="#ffffff44">
//             ← Back
//           </Btn>
//           <span style={{ fontWeight: 600, color: '#fff' }}>{sub.title}</span>
//         </div>
//         {sub.units.map((u) => (
//           <div key={u.id} style={{ marginBottom: 18 }}>
//             <div
//               style={{
//                 fontSize: 10,
//                 letterSpacing: 2.5,
//                 color: sub.color,
//                 fontWeight: 700,
//                 marginBottom: 8,
//               }}
//             >
//               UNIT {u.unit} — {u.title.toUpperCase()}
//             </div>
//             {u.topics.map((t) => {
//               const has = QB[t.id];
//               return (
//                 <div
//                   key={t.id}
//                   onClick={() => has && setTopic({ ...t, subject: sub })}
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     padding: '11px 13px',
//                     borderRadius: 10,
//                     cursor: has ? 'pointer' : 'default',
//                     opacity: has ? 1 : 0.3,
//                     marginBottom: 3,
//                     transition: 'all .15s',
//                   }}
//                   onMouseEnter={(e) =>
//                     has && (e.currentTarget.style.background = '#ffffff08')
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = 'transparent')
//                   }
//                 >
//                   <span style={{ fontSize: 13 }}>{t.title}</span>
//                   {has ? (
//                     <Badge c={sub.color}>{QB[t.id].length} Qs</Badge>
//                   ) : (
//                     <span style={{ fontSize: 10, color: '#ffffff22' }}>
//                       coming soon
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
//     );

//   if (!q)
//     return (
//       <div className="fade">
//         <div
//           style={{
//             display: 'flex',
//             gap: 9,
//             alignItems: 'center',
//             marginBottom: 20,
//           }}
//         >
//           <Btn sm onClick={() => setTopic(null)} c="#ffffff44">
//             ← Topics
//           </Btn>
//           <span style={{ fontWeight: 600, color: '#fff' }}>{topic.title}</span>
//         </div>
//         {qs.map((qq) => (
//           <Card
//             key={qq.id}
//             onClick={() => {
//               setQ(qq);
//               setAns('');
//               setResult(null);
//               setHint('');
//               setErr('');
//             }}
//             style={{ marginBottom: 10, cursor: 'pointer' }}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 gap: 10,
//                 alignItems: 'center',
//                 marginBottom: 8,
//               }}
//             >
//               <Badge
//                 c={
//                   qq.marks >= 10
//                     ? '#ef4444'
//                     : qq.marks >= 5
//                     ? '#f59e0b'
//                     : '#00c9a7'
//                 }
//               >
//                 {qq.marks} Marks
//               </Badge>
//               <span style={{ fontSize: 10, color: '#ffffff33' }}>
//                 {qq.marks >= 10
//                   ? 'Long Answer'
//                   : qq.marks >= 5
//                   ? 'Short Answer'
//                   : 'Very Short'}
//               </span>
//             </div>
//             <div style={{ fontSize: 13, color: '#dde1f0', lineHeight: 1.65 }}>
//               {qq.question}
//             </div>
//           </Card>
//         ))}
//       </div>
//     );

//   return (
//     <div className="fade">
//       <Btn sm onClick={() => setQ(null)} c="#ffffff44">
//         ← Questions
//       </Btn>
//       <Card style={{ margin: '16px 0' }}>
//         <Badge
//           c={q.marks >= 10 ? '#ef4444' : q.marks >= 5 ? '#f59e0b' : '#00c9a7'}
//         >
//           {q.marks} Marks
//         </Badge>
//         <div
//           style={{
//             fontSize: 15,
//             color: '#fff',
//             fontWeight: 500,
//             lineHeight: 1.65,
//             marginTop: 10,
//           }}
//         >
//           {q.question}
//         </div>
//       </Card>

//       <div style={{ marginBottom: 12 }}>
//         <Btn sm onClick={getHint} c="#f59e0b">
//           {hintLoad ? (
//             <>
//               <Spin /> Loading...
//             </>
//           ) : (
//             '💡 Get a Hint'
//           )}
//         </Btn>
//         {hint && (
//           <div
//             style={{
//               marginTop: 10,
//               background: '#f59e0b0f',
//               border: '1px solid #f59e0b25',
//               borderRadius: 10,
//               padding: 13,
//               fontSize: 12,
//               color: '#fcd34d',
//               lineHeight: 1.75,
//             }}
//           >
//             {hint}
//           </div>
//         )}
//       </div>

//       <textarea
//         value={ans}
//         onChange={(e) => setAns(e.target.value)}
//         rows={9}
//         placeholder={`Write your ${q.marks}-mark answer here in your own words...\n\nTip: Don't just copy — write it yourself. That's how you actually learn! 😊`}
//         style={{
//           width: '100%',
//           background: '#ffffff08',
//           border: '1px solid #ffffff15',
//           borderRadius: 12,
//           padding: 16,
//           color: '#dde1f0',
//           fontSize: 13,
//           lineHeight: 1.8,
//           resize: 'vertical',
//           outline: 'none',
//         }}
//       />

//       <div
//         style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}
//       >
//         <Btn onClick={evaluate} disabled={loading || !ans.trim()} c="#00c9a7">
//           {loading ? (
//             <>
//               <Spin /> Evaluating...
//             </>
//           ) : (
//             '◈ Submit for AI Evaluation'
//           )}
//         </Btn>
//         <Btn
//           sm
//           onClick={() => {
//             setAns('');
//             setResult(null);
//             setHint('');
//           }}
//           c="#ffffff44"
//         >
//           Clear
//         </Btn>
//       </div>

//       {err && (
//         <div
//           style={{
//             marginTop: 12,
//             background: '#ef444412',
//             border: '1px solid #ef444430',
//             borderRadius: 10,
//             padding: 13,
//             color: '#f87171',
//             fontSize: 12,
//           }}
//         >
//           {err}
//         </div>
//       )}

//       {result && (
//         <div
//           className="fade"
//           style={{
//             marginTop: 20,
//             background: '#ffffff05',
//             border: '1px solid #ffffff0d',
//             borderRadius: 14,
//             padding: 22,
//           }}
//         >
//           <div
//             style={{
//               display: 'flex',
//               gap: 14,
//               alignItems: 'center',
//               marginBottom: 18,
//               background: '#ffffff08',
//               borderRadius: 10,
//               padding: '12px 16px',
//             }}
//           >
//             <div
//               style={{
//                 fontSize: 26,
//                 fontWeight: 600,
//                 color:
//                   result.got / q.marks >= 0.7
//                     ? '#00c9a7'
//                     : result.got / q.marks >= 0.4
//                     ? '#f59e0b'
//                     : '#ef4444',
//               }}
//             >
//               {result.got}/{q.marks}
//             </div>
//             <div>
//               <div style={{ fontSize: 13, color: '#fff' }}>Marks Awarded</div>
//               <div style={{ fontSize: 11, color: '#ffffff44' }}>
//                 {Math.round((result.got / q.marks) * 100)}% —{' '}
//                 {result.got / q.marks >= 0.7
//                   ? 'Great work! 🎉'
//                   : result.got / q.marks >= 0.4
//                   ? 'Getting there! 💪'
//                   : 'Revise and retry! 📖'}
//               </div>
//             </div>
//           </div>
//           <AIText text={result.text} />
//         </div>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  LAB TAB
// // ═══════════════════════════════════════════════════════════════════
// const LABS = [
//   {
//     id: 'l1',
//     sub: 'ds',
//     title: 'Stack using Array (C)',
//     type: 'C',
//     desc: 'Build push, pop, peek — like a pile of books!',
//     starter: `#include <stdio.h>
// #define MAX 10
// int stack[MAX], top = -1;

// void push(int val) {
//     // TODO: if stack not full, add val
// }
// int pop() {
//     // TODO: if stack not empty, remove top
//     return -1;
// }
// void display() {
//     // TODO: print all elements top to bottom
// }
// int main() {
//     push(10); push(20); push(30);
//     display();
//     printf("Popped: %d\\n", pop());
//     display();
//     return 0;
// }`,
//     solution: `#include <stdio.h>
// #define MAX 10
// int stack[MAX], top = -1;

// void push(int val) {
//     if(top == MAX-1) { printf("Stack Full!\\n"); return; }
//     stack[++top] = val;
// }
// int pop() {
//     if(top == -1) { printf("Stack Empty!\\n"); return -1; }
//     return stack[top--];
// }
// void display() {
//     printf("Stack: ");
//     for(int i = top; i >= 0; i--) printf("%d ", stack[i]);
//     printf("\\n");
// }
// int main() {
//     push(10); push(20); push(30);
//     display();
//     printf("Popped: %d\\n", pop());
//     display();
//     return 0;
// }`,
//     tests: [
//       'Push 10,20,30 → prints 30 20 10',
//       'Pop → returns 30',
//       'Display after pop → 20 10',
//     ],
//   },
//   {
//     id: 'l2',
//     sub: 'py',
//     title: 'Binary Search in Python',
//     type: 'Python',
//     desc: 'Find a number in sorted list quickly!',
//     starter: `def binary_search(arr, target):
//     low, high = 0, len(arr) - 1
//     while low <= high:
//         mid = (low + high) // 2
//         # TODO: check arr[mid] == target
//         # TODO: if target bigger, search right
//         # TODO: if target smaller, search left
//     return -1

// nums = [2,5,8,12,16,23,38,56,72,91]
// print(binary_search(nums, 23))   # → 5
// print(binary_search(nums, 100))  # → -1`,
//     solution: `def binary_search(arr, target):
//     low, high = 0, len(arr) - 1
//     while low <= high:
//         mid = (low + high) // 2
//         if arr[mid] == target: return mid
//         elif target > arr[mid]: low = mid + 1
//         else: high = mid - 1
//     return -1

// nums = [2,5,8,12,16,23,38,56,72,91]
// print(binary_search(nums, 23))
// print(binary_search(nums, 100))`,
//     tests: [
//       'Search 23 → index 5',
//       'Search 100 → -1',
//       'Works on any sorted list',
//     ],
//   },
//   {
//     id: 'l3',
//     sub: 'dbms',
//     title: 'SQL: Student Table CRUD',
//     type: 'SQL',
//     desc: 'Create, read, update, delete student records!',
//     starter: `-- Create table with id, name, age, marks
// CREATE TABLE Student (
//     -- TODO: add columns
// );
// -- Insert 3 students
// -- TODO: INSERT rows
// -- Show students with marks > 70
// -- TODO: SELECT query
// -- Update Priya's age to 23
// -- TODO: UPDATE query`,
//     solution: `CREATE TABLE Student (
//     id INT PRIMARY KEY,
//     name VARCHAR(50),
//     age INT,
//     marks FLOAT
// );
// INSERT INTO Student VALUES (1,'Priya',22,85.5);
// INSERT INTO Student VALUES (2,'Rahul',23,67.0);
// INSERT INTO Student VALUES (3,'Ananya',21,91.0);
// SELECT * FROM Student WHERE marks > 70;
// UPDATE Student SET age = 23 WHERE id = 1;`,
//     tests: [
//       'Table with 4 columns',
//       '3 rows inserted',
//       'SELECT returns Priya & Ananya',
//       'UPDATE changes age',
//     ],
//   },
// ];

// function LabTab({ plan, tryAI, recordAI }) {
//   const [ex, setEx] = useState(null);
//   const [code, setCode] = useState('');
//   const [tab, setTab] = useState('code');
//   const [fb, setFb] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState('');

//   const evaluate = () =>
//     tryAI(async () => {
//       setLoading(true);
//       setFb(null);
//       setErr('');
//       const SYSTEM = `You are a friendly lab evaluator for MCA students. Use simple English. Be encouraging. Explain bugs clearly.`;
//       const prompt = `Evaluate this ${ex.type} code for MCA lab exercise.

// EXERCISE: ${ex.title}
// STUDENT CODE:
// ${code}

// MODEL SOLUTION:
// ${ex.solution}

// TEST CASES: ${ex.tests.join(' | ')}

// Reply in this format:

// CORRECTNESS: [n]/10
// EFFICIENCY: [n]/10

// ✅ WHAT'S WORKING:
// - [correct part]

// 🐛 BUGS / ISSUES:
// - [specific issue — what line, what's wrong]

// 💡 HOW TO FIX:
// - [specific fix in simple words]

// 📊 TEST RESULTS:
// - [which tests pass/fail]

// 📝 GRADE: [A/B/C/D]

// 🚀 ONE IMPROVEMENT IDEA:
// [One suggestion to make code even better]`;
//       try {
//         const r = await callAI([{ role: 'user', content: prompt }], SYSTEM);
//         setFb(r);
//         recordAI();
//       } catch (e) {
//         if (e.message === 'NO_KEY') setErr('No API key. Go to ⚙ Settings.');
//         else setErr('Evaluation failed. Check connection and try again.');
//       }
//       setLoading(false);
//     });

//   if (!ex)
//     return (
//       <div className="fade">
//         <h2
//           style={{
//             fontSize: 17,
//             fontWeight: 600,
//             color: '#fff',
//             marginBottom: 4,
//           }}
//         >
//           Lab Exercises
//         </h2>
//         <p style={{ color: '#ffffff44', fontSize: 12, marginBottom: 22 }}>
//           Code, get AI feedback, fix bugs, learn by doing 🛠️
//         </p>
//         {LABS.map((l) => {
//           const s = SUBJECTS.find((x) => x.id === l.sub);
//           return (
//             <Card
//               key={l.id}
//               onClick={() => {
//                 setEx(l);
//                 setCode(l.starter);
//                 setFb(null);
//                 setTab('code');
//                 setErr('');
//               }}
//               style={{ marginBottom: 11, cursor: 'pointer' }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start',
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontWeight: 500,
//                       fontSize: 14,
//                       color: '#fff',
//                       marginBottom: 5,
//                     }}
//                   >
//                     {l.title}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 12,
//                       color: '#ffffff55',
//                       marginBottom: 10,
//                     }}
//                   >
//                     {l.desc}
//                   </div>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <Badge
//                       c={
//                         l.type === 'SQL'
//                           ? '#06b6d4'
//                           : l.type === 'Python'
//                           ? '#84cc16'
//                           : '#f59e0b'
//                       }
//                     >
//                       {l.type}
//                     </Badge>
//                     {s && <Badge c={s.color}>{s.code}</Badge>}
//                   </div>
//                 </div>
//                 <span style={{ fontSize: 28 }}>
//                   {l.type === 'SQL' ? '🗃️' : l.type === 'Python' ? '🐍' : '⚙️'}
//                 </span>
//               </div>
//             </Card>
//           );
//         })}
//       </div>
//     );

//   return (
//     <div className="fade">
//       <div
//         style={{
//           display: 'flex',
//           gap: 9,
//           alignItems: 'center',
//           marginBottom: 16,
//         }}
//       >
//         <Btn sm onClick={() => setEx(null)} c="#ffffff44">
//           ← Labs
//         </Btn>
//         <span style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>
//           {ex.title}
//         </span>
//         <Badge
//           c={
//             ex.type === 'SQL'
//               ? '#06b6d4'
//               : ex.type === 'Python'
//               ? '#84cc16'
//               : '#f59e0b'
//           }
//         >
//           {ex.type}
//         </Badge>
//       </div>
//       <div
//         style={{
//           background: '#f59e0b0e',
//           border: '1px solid #f59e0b22',
//           borderRadius: 10,
//           padding: 11,
//           marginBottom: 14,
//           fontSize: 12,
//           color: '#fcd34d',
//         }}
//       >
//         📌 {ex.desc}
//       </div>

//       <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
//         {[
//           ['code', '✏️ Your Code'],
//           ['solution', '🔑 Solution'],
//           ['tests', '🧪 Tests'],
//         ].map(([t, l]) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             style={{
//               background: tab === t ? '#ffffff12' : 'transparent',
//               border: `1px solid ${tab === t ? '#ffffff22' : 'transparent'}`,
//               color: tab === t ? '#fff' : '#ffffff44',
//               cursor: 'pointer',
//               padding: '8px 15px',
//               borderRadius: 8,
//               fontSize: 11,
//               transition: 'all .18s',
//             }}
//           >
//             {l}
//           </button>
//         ))}
//       </div>

//       {tab === 'tests' ? (
//         <div>
//           {ex.tests.map((t, i) => (
//             <div
//               key={i}
//               style={{
//                 padding: '10px 13px',
//                 background: '#00c9a70d',
//                 border: '1px solid #00c9a720',
//                 borderRadius: 8,
//                 marginBottom: 8,
//                 fontSize: 12,
//                 color: '#00c9a7',
//                 fontFamily: 'monospace',
//               }}
//             >
//               ✓ {t}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <>
//           <textarea
//             value={tab === 'solution' ? ex.solution : code}
//             onChange={(e) => tab === 'code' && setCode(e.target.value)}
//             readOnly={tab === 'solution'}
//             rows={16}
//             style={{
//               width: '100%',
//               background: '#090d1a',
//               border: '1px solid #ffffff12',
//               borderRadius: 12,
//               padding: 15,
//               color: tab === 'solution' ? '#a78bfa' : '#84cc16',
//               fontSize: 12,
//               lineHeight: 1.85,
//               resize: 'vertical',
//               outline: 'none',
//               fontFamily: 'monospace',
//             }}
//           />
//           {tab === 'code' && (
//             <div style={{ marginTop: 11, display: 'flex', gap: 10 }}>
//               <Btn onClick={evaluate} disabled={loading} c="#00c9a7">
//                 {loading ? (
//                   <>
//                     <Spin /> Evaluating...
//                   </>
//                 ) : (
//                   '⬡ Evaluate My Code'
//                 )}
//               </Btn>
//               <Btn sm onClick={() => setCode(ex.starter)} c="#ffffff44">
//                 Reset
//               </Btn>
//             </div>
//           )}
//         </>
//       )}

//       {err && (
//         <div
//           style={{
//             marginTop: 12,
//             background: '#ef444412',
//             border: '1px solid #ef444430',
//             borderRadius: 10,
//             padding: 13,
//             color: '#f87171',
//             fontSize: 12,
//           }}
//         >
//           {err}
//         </div>
//       )}
//       {fb && (
//         <div
//           className="fade"
//           style={{
//             marginTop: 20,
//             background: '#ffffff05',
//             border: '1px solid #ffffff0d',
//             borderRadius: 14,
//             padding: 22,
//           }}
//         >
//           <div
//             style={{
//               fontWeight: 600,
//               color: '#00c9a7',
//               fontSize: 12,
//               letterSpacing: 1,
//               marginBottom: 14,
//             }}
//           >
//             ◈ AI CODE FEEDBACK
//           </div>
//           <AIText text={fb} />
//         </div>
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════
// //  MOCK TEST TAB
// // ═══════════════════════════════════════════════════════════════════
// function TestTab({ data, setData, plan, tryAI, recordAI }) {
//   const [phase, setPhase] = useState('setup');
//   const [cfg, setCfg] = useState({ subId: 'ds', dur: 30 });
//   const [qs, setQs] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [results, setResults] = useState(null);
//   const [evaling, setEvaling] = useState(false);
//   const timer = useRef(null);

//   const start = () => {
//     const sub = SUBJECTS.find((s) => s.id === cfg.subId);
//     const pool = [];
//     sub.units.forEach((u) =>
//       u.topics.forEach((t) => {
//         const q = QB[t.id];
//         if (q) pool.push(...q);
//       })
//     );
//     const sel = [
//       ...pool.filter((q) => q.marks === 2).slice(0, 3),
//       ...pool.filter((q) => q.marks === 5).slice(0, 3),
//       ...pool.filter((q) => q.marks === 10).slice(0, 1),
//       ...pool.filter((q) => q.marks === 13).slice(0, 1),
//     ];
//     if (!sel.length) {
//       const keys = Object.keys(QB).filter((k) => k.startsWith(cfg.subId));
//       keys.forEach((k) => pool.push(...QB[k]));
//       sel.push(...pool.slice(0, 5));
//     }
//     setQs(sel);
//     setAnswers({});
//     setTimeLeft(cfg.dur * 60);
//     setPhase('test');
//   };

//   useEffect(() => {
//     if (phase === 'test') {
//       timer.current = setInterval(
//         () =>
//           setTimeLeft((t) => {
//             if (t <= 1) {
//               clearInterval(timer.current);
//               submit();
//               return 0;
//             }
//             return t - 1;
//           }),
//         1000
//       );
//     }
//     return () => clearInterval(timer.current);
//   }, [phase]);

//   const submit = () => {
//     clearInterval(timer.current);
//     tryAI(async () => {
//       setPhase('results');
//       setEvaling(true);
//       const items = [];
//       for (const q of qs) {
//         const a = answers[q.id] || '';
//         if (!a.trim()) {
//           items.push({ q, got: 0, fb: 'Not attempted.' });
//           continue;
//         }
//         try {
//           const r = await callAI(
//             [
//               {
//                 role: 'user',
//                 content: `Evaluate (${q.marks}M): ${
//                   q.question
//                 }\nAnswer: ${a}\nKey: ${q.kp.join(', ')}\nReply: MARKS:[n]/${
//                   q.marks
//                 } | [one simple feedback sentence]`,
//               },
//             ],
//             'Be brief and fair.'
//           );
//           const m = r.match(/MARKS:(\d+)/);
//           const got = m ? Math.min(parseInt(m[1]), q.marks) : 0;
//           items.push({ q, got, fb: r });
//           recordAI();
//         } catch {
//           items.push({ q, got: 0, fb: 'Evaluation failed.' });
//         }
//       }
//       const total = items.reduce((s, r) => s + r.got, 0),
//         max = items.reduce((s, r) => s + r.q.marks, 0);
//       const sc = [
//         ...(data.scores || []),
//         ...items.map((i) => ({
//           id: i.q.id,
//           got: i.got,
//           max: i.q.marks,
//           date: Date.now(),
//         })),
//       ];
//       setData({ ...data, scores: sc });
//       setResults({ items, total, max });
//       setEvaling(false);
//     });
//   };

//   const fmt = (s) =>
//     `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(
//       2,
//       '0'
//     )}`;

//   if (phase === 'setup')
//     return (
//       <div className="fade">
//         <h2
//           style={{
//             fontSize: 17,
//             fontWeight: 600,
//             color: '#fff',
//             marginBottom: 4,
//           }}
//         >
//           Mock Test
//         </h2>
//         <p style={{ color: '#ffffff44', fontSize: 12, marginBottom: 22 }}>
//           Timed exam simulation with AI scoring 🎯
//         </p>
//         <Card style={{ maxWidth: 520 }}>
//           <div style={{ marginBottom: 20 }}>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: '#ffffff33',
//                 letterSpacing: 2,
//                 marginBottom: 10,
//               }}
//             >
//               SELECT SUBJECT
//             </div>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//               {SUBJECTS.map((s) => (
//                 <button
//                   key={s.id}
//                   onClick={() => setCfg((c) => ({ ...c, subId: s.id }))}
//                   style={{
//                     padding: '8px 14px',
//                     background:
//                       cfg.subId === s.id ? s.color + '22' : '#ffffff08',
//                     border: `1px solid ${
//                       cfg.subId === s.id ? s.color : '#ffffff15'
//                     }`,
//                     borderRadius: 8,
//                     color: cfg.subId === s.id ? s.color : '#ffffff44',
//                     cursor: 'pointer',
//                     fontSize: 11,
//                     fontWeight: 700,
//                   }}
//                 >
//                   {s.icon} {s.code}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div style={{ marginBottom: 24 }}>
//             <div
//               style={{
//                 fontSize: 10,
//                 color: '#ffffff33',
//                 letterSpacing: 2,
//                 marginBottom: 10,
//               }}
//             >
//               DURATION
//             </div>
//             <div style={{ display: 'flex', gap: 8 }}>
//               {[30, 60, 90].map((d) => (
//                 <button
//                   key={d}
//                   onClick={() => setCfg((c) => ({ ...c, dur: d }))}
//                   style={{
//                     flex: 1,
//                     padding: '10px',
//                     background: cfg.dur === d ? '#00c9a722' : '#ffffff08',
//                     border: `1px solid ${
//                       cfg.dur === d ? '#00c9a7' : '#ffffff15'
//                     }`,
//                     borderRadius: 8,
//                     color: cfg.dur === d ? '#00c9a7' : '#ffffff44',
//                     cursor: 'pointer',
//                     fontSize: 12,
//                   }}
//                 >
//                   {d} min
//                 </button>
//               ))}
//             </div>
//           </div>
//           <Btn full onClick={start} c="#00c9a7">
//             ◉ Start Mock Test
//           </Btn>
//         </Card>
//       </div>
//     );

//   if (phase === 'test')
//     return (
//       <div className="fade">
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: 18,
//             position: 'sticky',
//             top: 0,
//             background: '#07070e',
//             padding: '8px 0',
//             zIndex: 10,
//           }}
//         >
//           <div style={{ fontWeight: 600, color: '#fff' }}>
//             Mock Test · {qs.length} Questions
//           </div>
//           <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//             <div
//               style={{
//                 fontSize: 22,
//                 fontWeight: 600,
//                 color: timeLeft < 300 ? '#ef4444' : '#00c9a7',
//                 fontFamily: 'monospace',
//               }}
//             >
//               {fmt(timeLeft)}
//             </div>
//             <Btn sm onClick={submit} danger>
//               Submit
//             </Btn>
//           </div>
//         </div>
//         <Bar v={Object.keys(answers).length} max={qs.length} c="#00c9a7" />
//         <div
//           style={{
//             fontSize: 11,
//             color: '#ffffff33',
//             marginBottom: 16,
//             marginTop: 4,
//           }}
//         >
//           {Object.keys(answers).length}/{qs.length} answered
//         </div>
//         {qs.map((q, i) => (
//           <Card key={q.id} style={{ marginBottom: 14 }}>
//             <div
//               style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 marginBottom: 9,
//               }}
//             >
//               <span style={{ fontSize: 11, color: '#ffffff33' }}>
//                 Question {i + 1}
//               </span>
//               <Badge
//                 c={
//                   q.marks >= 10
//                     ? '#ef4444'
//                     : q.marks >= 5
//                     ? '#f59e0b'
//                     : '#00c9a7'
//                 }
//               >
//                 {q.marks} Marks
//               </Badge>
//             </div>
//             <div
//               style={{
//                 fontSize: 14,
//                 color: '#fff',
//                 fontWeight: 500,
//                 marginBottom: 11,
//                 lineHeight: 1.65,
//               }}
//             >
//               {q.question}
//             </div>
//             <textarea
//               value={answers[q.id] || ''}
//               onChange={(e) =>
//                 setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
//               }
//               placeholder="Your answer..."
//               rows={5}
//               style={{
//                 width: '100%',
//                 background: '#ffffff07',
//                 border: '1px solid #ffffff12',
//                 borderRadius: 8,
//                 padding: 12,
//                 color: '#dde1f0',
//                 fontSize: 12,
//                 resize: 'vertical',
//                 outline: 'none',
//                 fontFamily: 'inherit',
//               }}
//             />
//           </Card>
//         ))}
//         <Btn full onClick={submit} c="#00c9a7">
//           ◈ Submit & Get AI Results
//         </Btn>
//       </div>
//     );

//   return (
//     <div className="fade">
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: 22,
//         }}
//       >
//         <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: 0 }}>
//           Test Results
//         </h2>
//         <Btn sm onClick={() => setPhase('setup')} c="#ffffff44">
//           New Test
//         </Btn>
//       </div>
//       {evaling ? (
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             gap: 16,
//             padding: 60,
//             color: '#ffffff33',
//           }}
//         >
//           <Spin size={28} />
//           <div className="pulse" style={{ fontSize: 12 }}>
//             AI is marking your answers...
//           </div>
//         </div>
//       ) : (
//         results && (
//           <>
//             <div
//               style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(3,1fr)',
//                 gap: 13,
//                 marginBottom: 22,
//               }}
//             >
//               {[
//                 {
//                   l: 'Total Score',
//                   v: `${results.total}/${results.max}`,
//                   c: results.total / results.max >= 0.5 ? '#00c9a7' : '#ef4444',
//                 },
//                 {
//                   l: 'Percentage',
//                   v: `${Math.round((results.total / results.max) * 100)}%`,
//                   c: '#7c3aed',
//                 },
//                 {
//                   l: 'Attempted',
//                   v: `${results.items.filter((r) => r.got > 0).length}/${
//                     results.items.length
//                   }`,
//                   c: '#f59e0b',
//                 },
//               ].map((s) => (
//                 <Card key={s.l} style={{ textAlign: 'center', padding: 16 }}>
//                   <div
//                     style={{
//                       fontSize: 10,
//                       color: '#ffffff33',
//                       letterSpacing: 2,
//                       marginBottom: 8,
//                     }}
//                   >
//                     {s.l.toUpperCase()}
//                   </div>
//                   <div style={{ fontSize: 24, fontWeight: 600, color: s.c }}>
//                     {s.v}
//                   </div>
//                 </Card>
//               ))}
//             </div>
//             {results.items.map((r, i) => (
//               <Card key={i} style={{ marginBottom: 11 }}>
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     marginBottom: 7,
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: 12,
//                       color: '#ffffff55',
//                       flex: 1,
//                       marginRight: 10,
//                     }}
//                   >
//                     Q{i + 1}: {r.q.question.slice(0, 60)}...
//                   </span>
//                   <span
//                     style={{
//                       fontWeight: 700,
//                       color: r.got / r.q.marks >= 0.6 ? '#00c9a7' : '#ef4444',
//                       flexShrink: 0,
//                     }}
//                   >
//                     {r.got}/{r.q.marks}
//                   </span>
//                 </div>
//                 <div
//                   style={{ fontSize: 11, color: '#ffffff44', lineHeight: 1.65 }}
//                 >
//                   {r.fb}
//                 </div>
//               </Card>
//             ))}
//           </>
//         )
//       )}
//     </div>
//   );
// }
