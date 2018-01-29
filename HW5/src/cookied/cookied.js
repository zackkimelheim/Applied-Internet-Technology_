/*
author: Zachary Kimelheim
Ned id: zk377
*/
const uuid = require('node-uuid');
// manageSession and parseCookies

function parseCookies(req,res,next){
  if(req.get('Cookie')){
		const cookie = req.get('Cookie');
		const cookies = cookie.split(";");
		req.hwCookies = {};

		for(let i = 0; i < cookies.length; i++){
			req.hwCookies[cookies[i].split("=")[0]] = cookies[i].split("=")[1];
		}
	}

  next();
}

const sessionStore = {};

function manageSession(req,res,next){
  if(req.hwCookies){
    if(req.hwCookies["sessionId"]){

      if(sessionStore[req.hwCookies["sessionId"]]){
        req.hwSession = sessionStore[req.hwCookies["sessionId"]];
        req.hwSession.sessionId = req.hwCookies["sessionId"];
        console.log("Session already exists: [" + req.hwSession.sessionId+"]");
      }

      else{
        const sessionId = uuid.v4();
        sessionStore[sessionId] = {};
        res.append('Set-Cookie','sessionId = ' + sessionId + '; HTTPOnly');
        req.hwSession = sessionStore[sessionId];
        req.hwSession.sessionId = sessionId;
        console.log("Session Generated: [" + req.hwSession.sessionId+"]");
      }
    }
    else{
      const sessionId = uuid.v4();
      req.hwCookies["sessionId"] = sessionId;
      res.append('Set-Cookie','sessionId = ' + sessionId + '; HTTPOnly');
      req.hwSession = sessionStore[sessionId];
      req.hwSession.sessionId = sessionId;
      console.log("Session Generated: [" + req.hwSession.sessionId+"]");
    }
  }
  else{
    req.hwCookies = {};
    const sessionId = uuid.v4();
    sessionStore[sessionId] = {};
    req.hwCookies["sessionId"] = sessionId;
    res.append('Set-Cookie','sessionId = ' + sessionId + '; HTTPOnly');
    req.hwSession = sessionStore[sessionId];
    req.hwSession.sessionId = sessionId;
    console.log("Session Generated: [" + req.hwSession.sessionId+"]");
  }

  next();
}



module.exports = {
  parseCookies: parseCookies,
  manageSession: manageSession
};
