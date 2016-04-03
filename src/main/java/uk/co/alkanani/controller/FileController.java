package uk.co.alkanani.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import uk.co.alkanani.file.DirectoryUtil;
import uk.co.alkanani.file.FileUtil;
import uk.co.alkanani.json.FileJson;
import uk.co.alkanani.json.FilesJson;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

@RestController
@RequestMapping(path = "/files", produces = "application/json")
public class FileController {
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @RequestMapping(method = RequestMethod.GET)
    public void get(HttpServletResponse response) {
        try {
            logger.info("Redirecting /files to /files/");
            response.sendRedirect("/rest/files/");
        } catch (IOException e) {
            logger.error("Redirect to /files/ failed");
        }
    }

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public FilesJson getFiles() {
        return FileUtil.getFiles("/");
    }

    @RequestMapping(path = "/**", method = RequestMethod.GET)
    public FilesJson getFiles(HttpServletRequest request) {
        String path = request.getPathInfo();
        return FileUtil.getFiles(path.replaceFirst("/files", ""));
    }
}
