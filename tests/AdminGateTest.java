import fr.bonzeai.companion.AdminGate;
public class AdminGateTest{
 static void check(boolean b){if(!b)throw new AssertionError();}
 public static void main(String[] args){AdminGate g=new AdminGate();check(!g.allowed(1));long c=g.challenge();check(!g.complete(c,false,2));check(!g.allowed(3));c=g.challenge();check(g.complete(c,true,4));check(g.allowed(5));check(!g.allowed(120005));g.lock();check(!g.allowed(6));c=g.challenge();g.cancel();check(!g.complete(c,true,7));System.out.println("AdminGate: authorization, expiry, lock, stale challenge passed");}
}
