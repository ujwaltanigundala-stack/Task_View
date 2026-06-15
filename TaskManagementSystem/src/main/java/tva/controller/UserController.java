package tva.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import tva.models.Users;
import tva.services.UsersService;

@CrossOrigin(origins = "http://localhost:5173") // ✅ VERY IMPORTANT
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UsersService US;

    @PostMapping("/signup")
    public Object signup(@RequestBody Users user) {
        return US.signup(user);
    }

    @PostMapping("/signin")
    public Object signin(@RequestBody Map<String, Object> data) {
        return US.signin(data);
    }
    @GetMapping("/uinfo")
    public Object uinfo(@RequestHeader("Token") String token)
    {
    	return US.uinfo(token);
    } 
    
    @GetMapping("/profile")
    public Object profile(@RequestHeader("Token") String token)
    {
      return US.getProfile(token);
    }
    
    @GetMapping("/getallusers/{PAGE}/{SIZE}")
    public Object getAllUsers(@PathVariable("PAGE") int page, @PathVariable("SIZE") int size, @RequestHeader("Token") String token)
    {
      return US.getAllUsers(page, size, token);
    }
    
    
    @GetMapping("/getuser/{ID}")
    public Object getUser(@PathVariable("ID") Long id, @RequestHeader String Token)
    {
      return US.getUserById(id, Token);
    }
    
    @PostMapping("/saveuser")
    public Object saveUser(@RequestBody Users U, @RequestHeader String Token)
    {
      return US.saveUser(U, Token);
    }
    
    
    @PutMapping("/updateuser/{ID}")
    public Object updateUser(@PathVariable("ID") Long id, @RequestBody Users U, @RequestHeader String Token)
    {
      return US.updateUser(id, U, Token);
    }
    
    @DeleteMapping("/deleteuser/{ID}")
    public Object deleteUser(@PathVariable("ID") Long id, @RequestHeader String Token)
    {
      return US.deleteUser(id, Token);
    }
}