package uk.co.alkanani.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.co.alkanani.json.FileJson;
import uk.co.alkanani.json.FilesJson;

import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

public class FileUtil {
    private static final Logger logger = LoggerFactory.getLogger(FileUtil.class);

    public static FilesJson getFiles(String root) {
        FileSystem fileSystem = FileSystems.getDefault();
        Path rootPath = fileSystem.getPath(root);

        FilesJson filesJson = new FilesJson();

        try (Stream<Path> fileStream = Files.list(rootPath)) {
            fileStream
                    .filter(path -> Files.isReadable(path) && !isHidden(path))
                    .map(FileUtil::fileJsonMapper)
                    .forEach(filesJson.files::add);
        } catch (IOException e) {
            logger.error("Failed to access file stream", e);
        }

        return filesJson;
    }

    private static boolean isHidden(Path path) {
        try {
            return Files.isHidden(path);
        } catch (IOException e) {
            logger.error("Unable to check for hidden file", e);
            return true;
        }
    }

    private static FileJson fileJsonMapper(Path path) {
        FileJson fileJson = new FileJson();
        fileJson.name = path.getFileName().toString();
        fileJson.lastModified = path.toFile().lastModified();
        fileJson.isDirectory = Files.isDirectory(path);
        return fileJson;
    }
}
