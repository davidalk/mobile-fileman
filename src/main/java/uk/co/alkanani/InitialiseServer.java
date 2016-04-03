package uk.co.alkanani;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.resource.Resource;
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
            InitialiseServer initialiseServer = new InitialiseServer();
            initialiseServer.startServer();
        } catch (Exception e) {
            logger.error("Error starting server", e);
            throw new RuntimeException(e);
        }
    }

    private void startServer() throws Exception {
        Server server = new Server(8080);

        HandlerCollection handlerCollection = new HandlerCollection();
        handlerCollection.addHandler(getServletContextHandler(new XmlWebApplicationContext()));

        handlerCollection.addHandler(getStaticHandler());

        server.setHandler(handlerCollection);
        server.start();
        server.join();
    }

    private ServletContextHandler getServletContextHandler(WebApplicationContext context) throws IOException {
        ServletContextHandler contextHandler = new ServletContextHandler();
        contextHandler.setErrorHandler(null);
        contextHandler.setContextPath("/rest");
        contextHandler.addServlet(new ServletHolder(new DispatcherServlet(context)), "/*");
        contextHandler.addEventListener(new ContextLoaderListener(context));
        contextHandler.setResourceBase(new ClassPathResource("webapp").getURI().toString());
        return contextHandler;
    }

    private Handler getStaticHandler() throws Exception {
        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");

        if (System.getProperty("local") != null) {
            logger.warn("Running in local mode");
            context.setResourceBase("src/main/static/app/");
        } else {
            context.setBaseResource(Resource.newClassPathResource("static/app/"));
        }


        DefaultServlet defaultServlet = new DefaultServlet();
        context.addServlet(new ServletHolder(defaultServlet), "/*");
        return context;
    }

}
