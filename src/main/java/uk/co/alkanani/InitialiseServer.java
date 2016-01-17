package uk.co.alkanani;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.server.handler.gzip.GzipHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import java.io.IOException;

public class InitialiseServer {
    private static final Logger logger = LoggerFactory.getLogger(InitialiseServer.class);

    private InitialiseServer() {
    }

    public static void main(String... args) {
        try {
            boolean staticContent = true;

            if (args.length > 0  && args[0].equals("noStatic")) {
                logger.info("Starting without static content handler");
                staticContent = false;
            } else {
                logger.info("Starting static and servlet handlers");
            }

            InitialiseServer initialiseServer = new InitialiseServer();
            initialiseServer.startServer(staticContent);
        } catch (Exception e) {
            logger.error("Error starting server", e);
            throw new RuntimeException(e);
        }
    }

    private void startServer(boolean staticContent) throws Exception {
        Server server = new Server(8080);

        HandlerCollection handlerCollection = new HandlerCollection();
        handlerCollection.addHandler(getServletContextHandler(new XmlWebApplicationContext()));

        if (staticContent) {
            handlerCollection.addHandler(getStaticHandler());
        }

        server.setHandler(handlerCollection);
        server.start();
        server.join();
    }

    private ServletContextHandler getServletContextHandler(WebApplicationContext context) throws IOException {
        ServletContextHandler contextHandler = new ServletContextHandler();
        contextHandler.setErrorHandler(null);
        contextHandler.setContextPath("/webapp");
        contextHandler.addServlet(new ServletHolder(new DispatcherServlet(context)), "/*");
        contextHandler.addEventListener(new ContextLoaderListener(context));
        contextHandler.setResourceBase(new ClassPathResource("webapp").getURI().toString());
        return contextHandler;
    }

    private Handler getStaticHandler() throws Exception {
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setDirectoriesListed(true);
        resourceHandler.setWelcomeFiles(new String[]{"index.html"});
        resourceHandler.setResourceBase(new ClassPathResource("static/app").getURI().toString());

        GzipHandler gzip = new GzipHandler();
        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[]{resourceHandler, new DefaultHandler()});
        gzip.setHandler(handlers);

        return gzip;
    }

}
