package tva.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tva.models.Assignments;
import tva.models.Users;
import tva.repository.AssignmentsRepository;

@Service
public class AssignmentsService {

    @Autowired
    AssignmentsRepository AR;

    @Autowired
    JwtService JWT;

    public Object addAssignment(Assignments A, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            AR.save(A);

            response.put("code", 200);
            response.put("message", "Assignment Added Successfully");
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getAllAssignments(String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("assignments", AR.findAll());
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getAssignmentById(int id, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("assignment", AR.findById(id).orElse(null));
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getAssignmentsByUser(Users U, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("assignments", AR.findByUser(U));
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getAssignmentsByStatus(int status, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("assignments", AR.findByStatus(status));
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object updateAssignment(int id, Assignments A, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            Assignments assignment = AR.findById(id).orElse(null);

            if(assignment != null)
            {
                assignment.setTask(A.getTask());
                assignment.setUser(A.getUser());
                assignment.setAssignedBy(A.getAssignedBy());
                assignment.setAssignedAt(A.getAssignedAt());
                assignment.setStatus(A.getStatus());

                AR.save(assignment);

                response.put("code", 200);
                response.put("message", "Assignment Updated Successfully");
            }
            else
            {
                response.put("code", 404);
                response.put("message", "Assignment Not Found");
            }
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object deleteAssignment(int id, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            AR.deleteById(id);

            response.put("code", 200);
            response.put("message", "Assignment Deleted Successfully");
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }
}