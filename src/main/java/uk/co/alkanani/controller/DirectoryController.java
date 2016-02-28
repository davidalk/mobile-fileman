package uk.co.alkanani.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import uk.co.alkanani.file.DirectoryUtil;
import uk.co.alkanani.json.SubDirectoriesJson;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping(path = "/directories", produces = "application/json")
public class DirectoryController {
    private static final Logger logger = LoggerFactory.getLogger(DirectoryController.class);

    @RequestMapping(method = RequestMethod.GET)
    public void get(HttpServletResponse response) {
        try {
            logger.info("Redirecting /directories to /directories/");
            response.sendRedirect("/webapp/directories/");
        } catch (IOException e) {
            logger.error("Redirect to /directories/ failed", e);
        }
    }

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public SubDirectoriesJson getRootSubdirectories() {
        return DirectoryUtil.getSubDirectories("/");
    }

    @RequestMapping(path= "/**", method = RequestMethod.GET)
    public SubDirectoriesJson getSubDirectories(HttpServletRequest request) {
        String path = request.getPathInfo();
        return DirectoryUtil.getSubDirectories(path.replaceFirst("/directories", ""));
    }
}
