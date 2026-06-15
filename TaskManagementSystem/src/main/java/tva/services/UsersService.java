package tva.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import tva.models.Users;
import tva.models.Teams;
import tva.repository.TeamsRepository;
import tva.repository.UsersRepository;


@Service
public class UsersService {
  
  @Autowired
  UsersRepository UR;

  @Autowired
  TeamsRepository TR;

  // 🟢 SIGNUP
  public Object signup(Users U)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      Object id = UR.checkByEmail(U.getEmail());
      if(id != null)
      {        
        response.put("code", 501);
        response.put("message", "Email ID already registered");
      }
      else
      {
        assignTeam(U);
        U.setRole(1);      // default role: User
        U.setStatus(1);    // active user
        
        UR.save(U);        // save user
        
        response.put("code", 200);
        response.put("message", "User account has been created.");
      }
      
    }
    catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }
  
  @Autowired
  JwtService JWT;

  public Object signin(Map<String, Object> data)
  {
      Map<String, Object> response = new HashMap<>();

      try
      {
          Object role = UR.validateCredentials(
              data.get("email").toString(),
              data.get("password").toString()
          );

          if(role != null)
          {
              Users U = (Users) UR.findByEmail(data.get("email").toString());
              response.put("code", 200);

              response.put(
                  "jwt",
                  JWT.generateJWT(data.get("email"), role, U.getId())
              );

              response.put(
                  "email",
                  data.get("email")
              );
          }

          else
          {
              response.put("code", 404);

              response.put(
                  "message",
                  "Invalid Credentials!"
              );
          }

      }
      catch(Exception e)
      {
          response.put("code", 500);

          response.put(
              "message",
              e.getMessage()
          );
      }

      return response;
  }
  
  public Object uinfo(String token)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      Map<String, Object> payload = (Map<String, Object>) JWT.validateJWT(token);
      String email = (String) payload.get("email");
      Users U = (Users) UR.findByEmail(email);
      List<Object> menuList = UR.getMenus(Long.valueOf(U.getRole()));
  
      response.put("code", 200);
      response.put("fullname", U.getFullname());
      response.put("menulist", menuList);
    }
    catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }

  public Object getProfile(String token)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      Map<String, Object> payload = (Map<String, Object>) JWT.validateJWT(token);
      String email = (String) payload.get("email");
      Object user = UR.profileByEmail(email);
      
      response.put("code", 200);
      response.put("user", user);
    }
    catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }

  public Object getAllUsers(int page, int size, String token)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      JWT.validateJWT(token);
      Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").ascending());
      Page<Users> users = UR.findAll(pageable);
      
      response.put("code", 200);
      response.put("page", page);
      response.put("size", size);
      response.put("totalpages", users.getTotalPages());
      response.put("users", users.getContent());
    }
    catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }

  public Object getUserById(Long id, String token)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      JWT.validateJWT(token); //Authorization
      Users user = UR.findById(id).get();
      
      response.put("code", 200);
      response.put("user", user);
    }
    catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }
  
  public Object saveUser(Users U, String token)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      JWT.validateJWT(token); //Authorization
      
      Object id = UR.checkByEmail(U.getEmail());
      if(id != null)
        throw new Exception("Email ID already registered");
      
      U.setId(null);
      assignTeam(U);
      UR.save(U);      //Insert into the database table (users)
      
      response.put("code", 200);
      response.put("message", "New user account has been created.");
    }catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }
  
  public Object updateUser(Long id, Users U, String token)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      JWT.validateJWT(token); //Authorization
      
      Users temp = UR.findById(id).get();
      temp.setFullname(U.getFullname());
      temp.setPhone(U.getPhone());
      temp.setEmail(U.getEmail());
      temp.setPassword(U.getPassword());
      temp.setRole(U.getRole());
      temp.setStatus(U.getStatus());
      temp.setTeamId(U.getTeamId());
      assignTeam(temp);
      
      UR.save(temp);
            
          response.put("code", 200);
          response.put("message", "User has been updated");
    }catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }
  
  public Object deleteUser(Long id, String token)
  {
    Map<String, Object> response = new HashMap<>();
    try
    {
      JWT.validateJWT(token); //Authorization
      
      UR.deleteById(id);
            
          response.put("code", 200);
          response.put("message", "User has been deleted");
    }catch(Exception e)
    {
      response.put("code", 500);
      response.put("message", e.getMessage());
    }
    return response;
  }

  private void assignTeam(Users U)
  {
    if(U.getTeamId() == null)
    {
      U.setTeam(null);
      return;
    }

    Teams team = TR.findById(U.getTeamId()).orElse(null);
    U.setTeam(team);
  }
}
