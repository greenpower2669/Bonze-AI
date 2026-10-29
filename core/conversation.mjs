/**
 * Etat minimal de conversation ; aucune activation micro ne peut provenir de ce module.
 * Le pont Android est seul autorisé à lancer l'enregistrement après action humaine.
 */
export function createConversationSession() {
  let enabled=false, busy=false, turn=0;
  return {
    get enabled(){ return enabled; },
    get busy(){ return busy; },
    get turn(){ return turn; },
    start(){ enabled=true; },
    stop(){ enabled=false; busy=false; turn+=1; },
    isCurrent(id){ return busy && id===turn; },
    accept(text,source="text"){
      if(typeof text!=="string" || !text.trim() || busy) return false;
      if(source==="voice" && !enabled) return false;
      busy=true; turn+=1; return true;
    },
    finish(id=turn){ if(!busy||id!==turn)return false; busy=false;return enabled; }
  };
}

