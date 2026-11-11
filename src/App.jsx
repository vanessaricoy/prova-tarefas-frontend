import React,{useState,useEffect,useCallback,useRef} from 'react';
import {useAuth0} from '@auth0/auth0-react';
const empty={titulo:'',descricao:'',prioridade:'MEDIA',emailCriador:''};
export default function App(){
 const {isLoading,isAuthenticated,user,error:authError,loginWithRedirect,logout,getAccessTokenSilently}=useAuth0();
 const [form,setForm]=useState(empty),[items,setItems]=useState([]),[error,setError]=useState(''),[message,setMessage]=useState(''),[loading,setLoading]=useState(false),[busy,setBusy]=useState(false);
 const lock=useRef(false);
 const request=useCallback(async(path,options={})=>{
  const token=await getAccessTokenSilently();
  const response=await fetch(`/api${path}`,{...options,headers:{Authorization:`Bearer ${token}`,...(options.body?{'Content-Type':'application/json'}:{})}});
  const data=await response.json().catch(()=>null);
  if(!response.ok)throw new Error(response.status===401?'Sessão inválida: saia e entre novamente.':response.status===403?'Acesso recusado. Confira Auth0 e configuração da API.':data?.fields?Object.entries(data.fields).map(([k,v])=>`${k}: ${v}`).join('; '):data?.message||`Falha na API (${response.status}). Confira o proxy e o backend.`);
  return data;
 },[getAccessTokenSilently]);
 const load=useCallback(async(active=()=>true)=>{
  setLoading(true);
  try{const data=await request('/tarefa');if(!Array.isArray(data))throw new Error('Resposta inesperada: confira o destino /api no proxy.');if(active())setItems(data);}
  catch(e){if(active())setError(e.message);}finally{if(active())setLoading(false);}
 },[request]);
 useEffect(()=>{if(!isAuthenticated)return;let active=true;setForm(f=>({...f,emailCriador:user?.email||''}));load(()=>active);return()=>{active=false;};},[isAuthenticated,user?.email,load]);
 async function create(event){
  event.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setError('');setMessage('');
  try{await request('/tarefa',{method:'POST',body:JSON.stringify(form)});setForm({...empty,emailCriador:user?.email||''});setMessage('Tarefa criada.');await load();}
  catch(e){setError(e.message);}finally{lock.current=false;setBusy(false);}
 }
 async function remove(item){
  if(lock.current||!window.confirm(`Excluir a tarefa “${item.titulo}”?`))return;lock.current=true;setBusy(true);setError('');setMessage('');
  try{await request(`/tarefa?id=${encodeURIComponent(item.id)}`,{method:'DELETE'});setMessage('Tarefa excluída.');await load();}
  catch(e){setError(e.message);}finally{lock.current=false;setBusy(false);}
 }
 if(isLoading)return <main><p>Carregando sessão…</p></main>;
 return <main><header><div><span className="eyebrow">GERENCIAMENTO DE PROJETO</span><h1>Tarefas</h1></div>{isAuthenticated&&<button className="secondary" onClick={()=>logout({logoutParams:{returnTo:window.location.origin}})}>Sair</button>}</header>
  {authError&&<p role="alert">{authError.message}</p>}
  {!isAuthenticated?<section><h2>Organize o trabalho do projeto</h2><p>Entre para criar, listar e excluir tarefas.</p><button onClick={()=>loginWithRedirect()}>Entrar com Auth0</button><button className="secondary" onClick={()=>loginWithRedirect({authorizationParams:{screen_hint:'signup'}})}>Criar conta</button></section>:<>
   <p>Olá, {user?.name||user?.email}.</p>{error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}
   <section><h2>Nova tarefa</h2><form onSubmit={create}>
    <label>Título<input required maxLength="150" value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})}/></label>
    <label>Descrição<textarea required maxLength="4000" value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})}/></label>
    <label>Prioridade<select value={form.prioridade} onChange={e=>setForm({...form,prioridade:e.target.value})}><option value="BAIXA">Baixa</option><option value="MEDIA">Média</option><option value="ALTA">Alta</option></select></label>
    <label>Email de quem criou<input type="email" required maxLength="254" value={form.emailCriador} onChange={e=>setForm({...form,emailCriador:e.target.value})}/></label>
    <button disabled={busy}>{busy?'Aguarde…':'Criar tarefa'}</button>
   </form></section>
   <section><div className="section-heading"><h2>Tarefas do projeto</h2><button className="secondary" disabled={loading||busy} onClick={()=>{setError('');load();}}>Atualizar lista</button></div>
    {loading?<p role="status">Carregando tarefas…</p>:items.length===0?<p>Nenhuma tarefa cadastrada.</p>:<div className="table"><table><thead><tr><th>Título</th><th>Descrição</th><th>Prioridade</th><th>Criado por</th><th>Ação</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td>{item.titulo}</td><td>{item.descricao}</td><td><span className={`priority ${item.prioridade.toLowerCase()}`}>{item.prioridade==='MEDIA'?'Média':item.prioridade==='ALTA'?'Alta':'Baixa'}</span></td><td>{item.emailCriador}</td><td><button className="danger" disabled={busy} onClick={()=>remove(item)}>Excluir</button></td></tr>)}</tbody></table></div>}
   </section>
  </>}
 </main>;
}
