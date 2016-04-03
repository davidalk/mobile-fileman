package uk.co.alkanani.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.co.alkanani.json.FilesJson;

import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;

public class FileUtil {
    private static final Logger logger = LoggerFactory.getLogger(FileUtil.class);

    public static FilesJson getFiles(String root) {
        FileSystem fileSystem = FileSystems.getDefault();
        Path rootPath = fileSystem.getPath(root);
        return null;
    }
}
